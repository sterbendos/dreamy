import type { EditorCore } from "@/core";
import { toast } from "sonner";
import { mediaTimeFromSeconds } from "@/wasm";

export class CopilotManager {
	private ws: WebSocket | null = null;
	private isConnecting = false;

	constructor(private editor: EditorCore) {
		this.connect();
	}

	private connect() {
		if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
		this.isConnecting = true;

		try {
			this.ws = new WebSocket("ws://localhost:4242/browser");

			this.ws.onopen = () => {
				console.log("[Copilot] Connected to MCP WebSocket");
				this.isConnecting = false;
				toast.success("Claude Copilot Connected!", { id: "copilot-status" });
			};

			this.ws.onmessage = async (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data.command && data.id) {
						await this.handleCommand(data.id, data.command, data.args || {});
					}
				} catch (e) {
					console.error("[Copilot] Failed to parse message", e);
				}
			};

			this.ws.onclose = () => {
				console.log("[Copilot] Disconnected from MCP WebSocket");
				this.ws = null;
				this.isConnecting = false;
				// Auto-reconnect after 5 seconds
				setTimeout(() => this.connect(), 5000);
			};

			this.ws.onerror = (err) => {
				console.error("[Copilot] WebSocket error:", err);
				this.ws?.close();
			};
		} catch (e) {
			this.isConnecting = false;
		}
	}

	private async handleCommand(id: string, command: string, args: any) {
		try {
			let result: any = { success: true };

			switch (command) {
				case "split_element": {
					const { elementId, timeSeconds } = args;
					const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
					if (!trackId) throw new Error("Element not found");

					this.editor.timeline.splitElements({
						elements: [{ trackId, elementId }],
						splitTime: mediaTimeFromSeconds({ seconds: timeSeconds }),
					});
					result = { message: `Successfully split element ${elementId} at ${timeSeconds}s` };
					break;
				}

				case "add_text": {
					const { text, startTimeSeconds, durationSeconds, fontSize } = args;
					const textTrackId = this.editor.timeline.addTrack({ type: "text" });

					const durationTicks = mediaTimeFromSeconds({ seconds: durationSeconds }).ticks;
					const startTimeTicks = mediaTimeFromSeconds({ seconds: startTimeSeconds }).ticks;

					const textElement = {
						type: "text" as const,
						name: "Subtitle",
						startTime: { ticks: startTimeTicks },
						duration: { ticks: durationTicks },
						trimStart: { ticks: 0 },
						trimEnd: { ticks: durationTicks },
						params: {
							text: text,
							fontSize: fontSize || 48,
							fillColor: "#ffffff",
							strokeColor: "#000000",
							strokeWidth: 2,
							fontFamily: "Inter"
						}
					};

					this.editor.timeline.insertElement({
						element: textElement as any,
						placement: { trackId: textTrackId, time: textElement.startTime }
					});

					result = { message: `Added text: "${text}" at ${startTimeSeconds}s` };
					break;
				}

				case "delete_element": {
					const { elementId } = args;
					const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
					if (!trackId) throw new Error("Element not found");

					this.editor.timeline.deleteElements({
						elements: [{ trackId, elementId }]
					});
					result = { message: `Deleted element ${elementId}` };
					break;
				}

				case "get_timeline_state": {
					const activeScene = this.editor.scenes.getActiveSceneOrNull();
					if (!activeScene) throw new Error("No active scene");
					
					// Return a simplified structure for the LLM
					result = {
						tracks: {
							video: activeScene.tracks.main.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })),
							audio: activeScene.tracks.audio.map(t => ({ id: t.id, elements: t.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })) })),
							overlay: activeScene.tracks.overlay.map(t => ({ id: t.id, elements: t.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })) }))
						}
					};
					break;
				}

				default:
					throw new Error(`Unknown command: ${command}`);
			}

			// Send success response
			this.ws?.send(JSON.stringify({ id, result }));
			toast.success(`Copilot executed: ${command}`);
		} catch (error: any) {
			console.error(`[Copilot] Command ${command} failed:`, error);
			this.ws?.send(JSON.stringify({ id, error: error.message || "Execution failed" }));
			toast.error(`Copilot failed to execute ${command}: ${error.message}`);
		}
	}

	public destroy() {
		this.ws?.close();
	}
}
