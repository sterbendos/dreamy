import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { z } from "zod";
import { checkChatRateLimit } from "@/auth/rate-limit";

// Initialize OpenRouter provider
// The API key is read automatically from process.env.OPENROUTER_API_KEY
// Because it does not have the NEXT_PUBLIC_ prefix, it will never be leaked to the client bundle.
const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

// Maximum duration for the serverless function
export const maxDuration = 60;

export async function POST(req: Request) {
	// --- Rate limiting ---
	// Check before doing anything else so blocked users never hit OpenRouter.
	const { success, remaining, retryAfterSeconds } = await checkChatRateLimit({ request: req });
	if (!success) {
		return new Response(
			JSON.stringify({
				error: "Too many requests. You've used up your AI messages for this window.",
				retryAfterSeconds,
			}),
			{
				status: 429,
				headers: {
					"Content-Type": "application/json",
					"Retry-After": String(retryAfterSeconds),
					"X-RateLimit-Remaining": "0",
				},
			},
		);
	}

	try {
		const { messages, model = "meta-llama/llama-3-8b-instruct:free" } = await req.json();

		const result = streamText({
			model: openrouter(model),
			messages,
			// Define tools that the AI can call.
			// When the AI decides to call a tool, the Vercel AI SDK will pause the stream
			// and return the tool call to the client. The client (useChat) will then execute
			// the actual tool logic in the browser (where it has access to EditorCore), and 
			// send the tool result back to the server in a new request to continue the generation.
			tools: {
				split_element: {
					description: "Split a video or audio element at a specific time in seconds.",
					parameters: z.object({
						elementId: z.string().describe("The ID of the element to split"),
						timeSeconds: z.number().describe("The time in seconds where the split should occur"),
					}),
					// We do not implement the execute function here on the server because the server
					// has no access to the browser's video timeline memory. The execution happens client-side.
				},
				add_text: {
					description: "Add a text subtitle or graphic to the timeline.",
					parameters: z.object({
						text: z.string().describe("The text content to display"),
						startTimeSeconds: z.number().describe("When the text should start appearing (in seconds)"),
						durationSeconds: z.number().describe("How long the text should be visible (in seconds)"),
						fontSize: z.number().optional().describe("Font size (default 48)"),
					}),
				},
				delete_element: {
					description: "Delete an element from the timeline.",
					parameters: z.object({
						elementId: z.string().describe("The ID of the element to delete"),
					}),
				},
				get_timeline_state: {
					description: "Get the current state of the timeline, including all tracks and elements.",
					parameters: z.object({}),
				},
			},
			system: "You are Dreamy Copilot, an AI assistant integrated directly into a video editor. " +
					"You can help the user edit their video by using the provided tools. " +
					"When the user asks you to perform an action (e.g. 'split the first clip at 5 seconds'), " +
					"first use the get_timeline_state tool to understand what elements exist and their IDs, " +
					"then use the appropriate tools to make the edits. Be concise and helpful.",
		});

		return result.toDataStreamResponse({
			headers: {
				"X-RateLimit-Remaining": String(remaining),
			},
		});
	} catch (error) {
		console.error("[Chat API] Error:", error);
		return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500 });
	}
}
