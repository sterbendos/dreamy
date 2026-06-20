import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());

// MCP Server initialization
const mcpServer = new Server(
    { name: "DreamyCopilot", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// Map to store active browser connections
const browserClients = new Map<string, WebSocket>();
// Map to store pending commands waiting for browser response
const pendingCommands = new Map<string, { resolve: (res: any) => void; reject: (err: any) => void }>();

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
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

// Helper to send command to browser and wait for response
async function executeInBrowser(command: string, args: any): Promise<any> {
    if (browserClients.size === 0) {
        throw new Error("No active Dreamy browser tab is connected to the Copilot.");
    }

    const commandId = randomUUID();
    const client = Array.from(browserClients.values())[0]; // Just grab the first connected browser

    return new Promise((resolve, reject) => {
        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            pendingCommands.delete(commandId);
            reject(new Error("Browser execution timed out."));
        }, 10000);

        pendingCommands.set(commandId, {
            resolve: (res) => {
                clearTimeout(timeout);
                resolve(res);
            },
            reject: (err) => {
                clearTimeout(timeout);
                reject(err);
            }
        });

        client.send(JSON.stringify({
            id: commandId,
            command,
            args
        }));
    });
}

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const result = await executeInBrowser(request.params.name, request.params.arguments);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
    } catch (err: any) {
        return {
            content: [{ type: "text", text: `Error: ${err.message}` }],
            isError: true
        };
    }
});

// --- HTTP Endpoints for MCP SSE ---
let transport: SSEServerTransport | null = null;

app.get("/sse", async (req, res) => {
    console.log("Claude connected via SSE!");
    transport = new SSEServerTransport("/message", res);
    await mcpServer.connect(transport);
});

app.post("/message", async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send("No active SSE transport.");
    }
});

// --- Start the server ---
const port = 4242;
const server = app.listen(port, () => {
    console.log(`Dreamy MCP Server running on http://localhost:${port}`);
});

// --- WebSocket Server for Browser ---
const wss = new WebSocketServer({ server, path: "/browser" });

wss.on("connection", (ws) => {
    const id = randomUUID();
    browserClients.set(id, ws);
    console.log(`Browser tab connected to Copilot (ID: ${id})`);

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            const pending = pendingCommands.get(data.id);
            if (pending) {
                if (data.error) {
                    pending.reject(new Error(data.error));
                } else {
                    pending.resolve(data.result);
                }
                pendingCommands.delete(data.id);
            }
        } catch (e) {
            console.error("Failed to parse browser message", e);
        }
    });

    ws.on("close", () => {
        browserClients.delete(id);
        console.log(`Browser tab disconnected (ID: ${id})`);
    });
});
