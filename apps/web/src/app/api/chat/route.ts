import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { z } from "zod";
import { checkChatRateLimit } from "@/auth/rate-limit";
import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { getUserSubscription, getUserUsageToday, incrementUserUsage } from "@/billing/service";
import { LIMITS, getAvailableModels, Tier } from "@/billing/tiers";

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
		// --- Auth and Tier limits ---
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		let tier: Tier = "free";
		let userId: string | null = null;

		if (session?.user) {
			userId = session.user.id;
			const subscriptionInfo = await getUserSubscription(userId);
			tier = subscriptionInfo.tier;
			const usage = await getUserUsageToday(userId);

			if (usage.count >= LIMITS[tier].dailyCommands) {
				return new Response(
					JSON.stringify({ error: `Daily limit reached. You've used all ${LIMITS[tier].dailyCommands} commands for today.` }),
					{ status: 403 },
				);
			}
		}

		const { messages, model = "deepseek/deepseek-chat-v3:free" } = await req.json();

		const availableModels = getAvailableModels(tier);
		const isModelAllowed = availableModels.some((m) => m.id === model);

		if (!isModelAllowed) {
			return new Response(
				JSON.stringify({ error: "Model not available for your current plan." }),
				{ status: 403 },
			);
		}

		const result = streamText({
			model: openrouter(model),
			messages,
			// Tools are executed client-side via onToolCall in useChat —
			// the server only declares the schema so the AI can call them.
			// The client (CopilotPanel) has direct access to EditorCore and performs the actual mutation.
			tools: {
				split_element: {
					description: "Split a video or audio element at a specific time in seconds.",
					parameters: z.object({
						elementId: z.string().describe("The ID of the element to split"),
						timeSeconds: z.number().describe("The time in seconds where the split should occur"),
					}),
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
			system:
				"You are Dreamy Copilot, an AI assistant integrated directly into a video editor. " +
				"You can help the user edit their video by using the provided tools. " +
				"When the user asks you to perform an action (e.g. 'split the first clip at 5 seconds'), " +
				"first use the get_timeline_state tool to understand what elements exist and their IDs, " +
				"then use the appropriate tools to make the edits. Be concise and helpful.",
			// Increment usage only after the stream is successfully established.
			onFinish: async () => {
				if (userId) {
					await incrementUserUsage(userId).catch((err) => {
						console.error("[Chat API] Failed to increment usage:", err);
					});
				}
			},
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
