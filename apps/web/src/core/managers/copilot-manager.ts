import type { EditorCore } from "@/core";
import { toast } from "sonner";
import { mediaTimeFromSeconds } from "@/wasm";

/**
 * CopilotManager — exposes editor actions to the AI chat widget.
 *
 * The AI chat uses Vercel AI SDK's useChat hook with client-side tool execution.
 * When the AI decides to call a tool, useChat invokes onToolCall in CopilotPanel,
 * which calls copilot.executeTool(). No server-side execution, no WebSocket relay needed.
 */
export class CopilotManager {
	constructor(private editor: EditorCore) {}

	public async executeTool(name: string, args: unknown): Promise<unknown> {
		switch (name) {
			case "split_element": {
				const { elementId, timeSeconds } = args as { elementId: string; timeSeconds: number };
				const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
				if (!trackId) throw new Error(`Element "${elementId}" not found in timeline`);

				this.editor.timeline.splitElements({
					elements: [{ trackId, elementId }],
					splitTime: mediaTimeFromSeconds({ seconds: timeSeconds }),
				});

				toast.success(`Split element at ${timeSeconds}s`, { id: "copilot-action" });
				return { message: `Successfully split element ${elementId} at ${timeSeconds}s` };
			}

			case "add_text": {
				const { text, startTimeSeconds, durationSeconds, fontSize } = args as {
					text: string;
					startTimeSeconds: number;
					durationSeconds: number;
					fontSize?: number;
				};

				const textTrackId = this.editor.timeline.addTrack({ type: "text" });
				const durationTicks = mediaTimeFromSeconds({ seconds: durationSeconds }).ticks;
				const startTimeTicks = mediaTimeFromSeconds({ seconds: startTimeSeconds }).ticks;

				this.editor.timeline.insertElement({
					element: {
						type: "text" as const,
						name: "Subtitle",
						startTime: { ticks: startTimeTicks },
						duration: { ticks: durationTicks },
						trimStart: { ticks: 0 },
						trimEnd: { ticks: durationTicks },
						params: {
							text,
							fontSize: fontSize ?? 48,
							fillColor: "#ffffff",
							strokeColor: "#000000",
							strokeWidth: 2,
							fontFamily: "Inter",
						},
					} as any,
					placement: { trackId: textTrackId, time: { ticks: startTimeTicks } },
				});

				toast.success(`Added text: "${text}"`, { id: "copilot-action" });
				return { message: `Added text: "${text}" at ${startTimeSeconds}s for ${durationSeconds}s` };
			}

			case "delete_element": {
				const { elementId } = args as { elementId: string };
				const trackId = this.editor.timeline.findTrackIdForElement({ elementId });
				if (!trackId) throw new Error(`Element "${elementId}" not found in timeline`);

				this.editor.timeline.deleteElements({
					elements: [{ trackId, elementId }],
				});

				toast.success("Element deleted", { id: "copilot-action" });
				return { message: `Deleted element ${elementId}` };
			}

			case "get_timeline_state": {
				const activeScene = this.editor.scenes.getActiveSceneOrNull();
				if (!activeScene) throw new Error("No active scene");

				return {
					tracks: {
						video: activeScene.tracks.main.elements.map((e) => ({
							id: e.id,
							type: e.type,
							startSeconds: e.startTime.ticks / 90000,
							durationSeconds: e.duration.ticks / 90000,
						})),
						audio: activeScene.tracks.audio.map((t) => ({
							id: t.id,
							elements: t.elements.map((e) => ({
								id: e.id,
								type: e.type,
								startSeconds: e.startTime.ticks / 90000,
								durationSeconds: e.duration.ticks / 90000,
							})),
						})),
						overlay: activeScene.tracks.overlay.map((t) => ({
							id: t.id,
							elements: t.elements.map((e) => ({
								id: e.id,
								type: e.type,
								startSeconds: e.startTime.ticks / 90000,
								durationSeconds: e.duration.ticks / 90000,
							})),
						})),
					},
				};
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	}
}
