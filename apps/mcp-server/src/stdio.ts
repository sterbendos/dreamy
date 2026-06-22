import WebSocket from "ws";

const HUB_URL = "ws://localhost:4242/stdio";

// Connect to the central relay hub
const ws = new WebSocket(HUB_URL);

ws.on("open", () => {
    // We don't log to stdout because stdout is used for MCP JSON-RPC protocol
    console.error("[Stdio Proxy] Connected to Dreamy MCP Hub.");
});

// Forward data from WS -> stdout (to the external MCP client like Cursor)
ws.on("message", (data) => {
    // MCP client expects raw string/buffer
    process.stdout.write(data.toString() + "\n");
});

// Forward data from stdin -> WS (from the external MCP client)
process.stdin.on("data", (chunk) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(chunk.toString());
    }
});

ws.on("close", () => {
    console.error("[Stdio Proxy] Disconnected from Hub.");
    process.exit(1);
});

ws.on("error", (err) => {
    console.error(`[Stdio Proxy] Connection error: ${err.message}`);
    process.exit(1);
});
