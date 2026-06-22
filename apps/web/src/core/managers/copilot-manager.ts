import type { EditorCore } from "@/core";
import { toast } from "sonner";
import { mediaTimeFromSeconds } from "@/wasm";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

// Custom transport to connect the MCP Server to our WebSocket relay
class WebSocketRelayTransport implements Transport {
	private ws: WebSocket;
	public onclose?: () => void;
	public onerror?: (error: Error) => void;
	public onmessage?: (message: unknown) => void;

	constructor(url: string) {
		this.ws = new WebSocket(url);

		this.ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				this.onmessage?.(message);
			} catch (e) {
				console.error("[MCP Transport] Failed to parse message", e);
			}
		};

		this.ws.onclose = () => {
			this.onclose?.();
		};

		this.ws.onerror = (event) => {
			this.onerror?.(new Error("WebSocket error"));
		};
	}

	async start(): Promise<void> {
		if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
		return new Promise((resolve, reject) => {
			this.ws.addEventListener("open", () => resolve(), { once: true });
			this.ws.addEventListener("error", (e) => reject(e), { once: true });
		});
	}

	async close(): Promise<void> {
		this.ws.close();
	}

	async send(message: unknown): Promise<void> {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(message));
		}
	}
}

export class CopilotManager {
	private mcpServer: Server;
	private transport: WebSocketRelayTransport | null = null;
	private isConnecting = false;

	constructor(private editor: EditorCore) {
		this.mcpServer = new Server(
			{ name: "DreamyCopilot", version: "1.0.0" },
			{ capabilities: { tools: {} } }
		);

		this.registerTools();
		this.connect();
	}

	public async executeTool(name: string, args: any): Promise<any> {
		let result: any = { success: true };

		if (name === "split_element") {
			const { elementId, timeSeconds } = args as any;
			const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
			if (!trackId) throw new Error("Element not found");

			this.editor.timeline.splitElements({
				elements: [{ trackId, elementId }],
				splitTime: mediaTimeFromSeconds({ seconds: timeSeconds }),
			});
			result = { message: `Successfully split element ${elementId} at ${timeSeconds}s` };
		} else if (name === "add_text") {
			const { text, startTimeSeconds, durationSeconds, fontSize } = args as any;
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
		} else if (name === "delete_element") {
			const { elementId } = args as any;
			const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
			if (!trackId) throw new Error("Element not found");

			this.editor.timeline.deleteElements({
				elements: [{ trackId, elementId }]
			});
			result = { message: `Deleted element ${elementId}` };
		} else if (name === "get_timeline_state") {
			const activeScene = this.editor.scenes.getActiveSceneOrNull();
			if (!activeScene) throw new Error("No active scene");
			
			result = {
				tracks: {
					video: activeScene.tracks.main.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })),
					audio: activeScene.tracks.audio.map(t => ({ id: t.id, elements: t.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })) })),
					overlay: activeScene.tracks.overlay.map(t => ({ id: t.id, elements: t.elements.map(e => ({ id: e.id, type: e.type, start: e.startTime.ticks, duration: e.duration.ticks })) }))
				}
			};
		} else {
			throw new Error(`Unknown command: ${name}`);
		}

		return result;
	}

	private registerTools() {
		this.mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
			return {
				tools: [
					{
						name: "split_element",
						description: "Split a video or audio element at a specific time in seconds.",
						inputSchema: {
							type: "object",
							properties: {
								elementId: { type: "string" },
								timeSeconds: { type: "number" }
							},
							required: ["elementId", "timeSeconds"]
						}
					},
					{
						name: "add_text",
						description: "Add a text subtitle or graphic to the timeline.",
						inputSchema: {
							type: "object",
							properties: {
								text: { type: "string" },
								startTimeSeconds: { type: "number" },
								durationSeconds: { type: "number" },
								fontSize: { type: "number" }
							},
							required: ["text", "startTimeSeconds", "durationSeconds"]
						}
					},
					{
						name: "delete_element",
						description: "Delete an element from the timeline.",
						inputSchema: {
							type: "object",
							properties: {
								elementId: { type: "string" }
							},
							required: ["elementId"]
						}
					},
					{
						name: "get_timeline_state",
						description: "Get the current state of the timeline, including all tracks and elements.",
						inputSchema: {
							type: "object",
							properties: {}
						}
					}
				]
			};
		});

		this.mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params;
			
			try {
				const result = await this.executeTool(name, args);
				toast.success(`Copilot executed: ${name}`, { id: "copilot-action" });
				return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
			} catch (error: any) {
				console.error(`[Copilot] Command ${name} failed:`, error);
				toast.error(`Copilot failed: ${error.message}`);
				return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
			}
		});
	}

	private async connect() {
		if (this.isConnecting) return;
		this.isConnecting = true;

		try {
			this.transport = new WebSocketRelayTransport("ws://localhost:4242/browser");
			await this.mcpServer.connect(this.transport);
			
			console.log("[Copilot] MCP Server connected to Relay Hub");
			toast.success("Ready for external AI!", { id: "copilot-status" });
			this.isConnecting = false;

			this.transport.onclose = () => {
				console.log("[Copilot] Disconnected from Relay Hub");
				this.transport = null;
				this.isConnecting = false;
				setTimeout(() => this.connect(), 5000);
			};

		} catch (e) {
			console.error("[Copilot] Failed to connect to Relay Hub", e);
			this.isConnecting = false;
			setTimeout(() => this.connect(), 5000);
		}
	}

	public destroy() {
		this.transport?.close();
	}
}
