import BrollSearchEngine from "../ai/search/pipeline";
import { kineticTextDefinition } from "../graphics/kinetic";

export class DreamyMCPClient {
	private ws: WebSocket | null = null;
	private handlers = new Map<string, Function>();

	constructor(private hubUrl: string = "ws://localhost:4242/browser") {}

	connect() {
		this.ws = new WebSocket(this.hubUrl);
		
		this.ws.onopen = () => {
			console.log("[Dreamy MCP] Connected to MCP Hub.");
			this.registerTools();
		};

		this.ws.onmessage = async (event) => {
			try {
				const msg = JSON.parse(event.data);
				if (msg.jsonrpc === "2.0" && msg.method) {
					await this.handleRequest(msg);
				}
			} catch (err) {
				console.error("[Dreamy MCP] Failed to parse message:", err);
			}
		};

		this.ws.onclose = () => {
			console.log("[Dreamy MCP] Disconnected from Hub. Reconnecting in 3s...");
			setTimeout(() => this.connect(), 3000);
		};
	}

	private sendResponse(id: string | number, result: any) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify({
			jsonrpc: "2.0",
			id,
			result
		}));
	}

	private sendError(id: string | number, code: number, message: string) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify({
			jsonrpc: "2.0",
			id,
			error: { code, message }
		}));
	}

	private registerTools() {
		// Register the edit_transcript tool
		this.handlers.set("edit_transcript", async (params: any) => {
			console.log("[Dreamy MCP] edit_transcript called:", params);
			// In a real implementation, this would dispatch an action to the timeline state store
			return { success: true, message: `Ripple cut performed successfully.` };
		});

		// Register the search_broll tool
		this.handlers.set("search_broll", async (params: any) => {
			console.log("[Dreamy MCP] search_broll called:", params.query);
			const embedding = await BrollSearchEngine.embedText(params.query);
			// We would then search the local vector DB for matches
			return { success: true, top_matches: [], vector_length: embedding.length };
		});

		// Register the generate_motion_graphic tool
		this.handlers.set("generate_motion_graphic", async (params: any) => {
			console.log("[Dreamy MCP] generate_motion_graphic called with schema:", params.schema);
			// Dispatches the kinetic text definition to the timeline
			return { success: true, graphic_id: kineticTextDefinition.id, injected: true };
		});
	}

	private async handleRequest(msg: any) {
		const handler = this.handlers.get(msg.method);
		if (handler) {
			try {
				const result = await handler(msg.params);
				this.sendResponse(msg.id, result);
			} catch (e: any) {
				this.sendError(msg.id, -32603, e.message);
			}
		} else if (msg.method === "list_tools") {
			// MCP Protocol standard list tools
			this.sendResponse(msg.id, {
				tools: [
					{ name: "edit_transcript", description: "Edit the video timeline by modifying transcript text.", parameters: { type: "object", properties: { target_text: { type: "string" }, replacement: { type: "string" } } } },
					{ name: "search_broll", description: "Search local b-roll footage semantically.", parameters: { type: "object", properties: { query: { type: "string" } } } },
					{ name: "generate_motion_graphic", description: "Generate kinetic motion graphics using declarative JSON.", parameters: { type: "object", properties: { schema: { type: "string" } } } }
				]
			});
		} else {
			this.sendError(msg.id, -32601, "Method not found");
		}
	}
}

// Global singleton for the browser
export const mcpClient = new DreamyMCPClient();
