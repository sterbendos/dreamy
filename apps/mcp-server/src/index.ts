import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());

// A map to store the active browser connections
// Right now we assume one active editor session at a time for simplicity.
let activeBrowserWs: WebSocket | null = null;

// Map of external client (SSE or Stdio) response streams to forward messages back to them
// Key is client ID, value is a callback that takes a JSON string
const externalClients = new Map<string, (data: string) => void>();

app.get("/sse", async (req, res) => {
    console.log("[Relay] External MCP Client connected via SSE!");
    
    const clientId = randomUUID();
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`endpoint: /message?id=${clientId}\n\n`);

    externalClients.set(clientId, (data: string) => {
        res.write(`event: message\ndata: ${data}\n\n`);
    });

    req.on("close", () => {
        console.log(`[Relay] SSE Client disconnected: ${clientId}`);
        externalClients.delete(clientId);
    });
});

app.post("/message", express.json(), async (req, res) => {
    const clientId = req.query.id as string;
    if (!clientId || !externalClients.has(clientId)) {
        return res.status(400).send("Invalid or missing client ID.");
    }

    if (!activeBrowserWs || activeBrowserWs.readyState !== WebSocket.OPEN) {
        return res.status(503).send("No active Dreamy browser session connected.");
    }

    // Forward the JSON-RPC message directly to the browser
    activeBrowserWs.send(JSON.stringify(req.body));
    res.status(202).send("Accepted");
});

const port = 4242;
const server = app.listen(port, () => {
    console.log(`[Relay] Dreamy MCP Hub running on http://localhost:${port}`);
});

// --- WebSocket Server ---
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://localhost:${port}`);
    
    if (url.pathname === "/browser") {
        console.log("[Relay] Browser session connected.");
        activeBrowserWs = ws;

        ws.on("message", (message) => {
            // Forward message from browser back to ALL external clients
            // In a more complex setup, we'd route this by JSON-RPC ID, but broadcasting is fine
            // since JSON-RPC clients ignore unknown response IDs.
            const dataStr = message.toString();
            for (const send of externalClients.values()) {
                send(dataStr);
            }
        });

        ws.on("close", () => {
            console.log("[Relay] Browser session disconnected.");
            if (activeBrowserWs === ws) {
                activeBrowserWs = null;
            }
        });
    } else if (url.pathname === "/stdio") {
        console.log("[Relay] Stdio proxy connected.");
        const clientId = randomUUID();
        
        externalClients.set(clientId, (data: string) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        ws.on("message", (message) => {
            if (!activeBrowserWs || activeBrowserWs.readyState !== WebSocket.OPEN) {
                console.error("[Relay] Received stdio message but no browser is connected.");
                return;
            }
            // Parse message in case it's a batch, or just forward string
            activeBrowserWs.send(message.toString());
        });

        ws.on("close", () => {
            console.log("[Relay] Stdio proxy disconnected.");
            externalClients.delete(clientId);
        });
    } else {
        ws.close();
    }
});
