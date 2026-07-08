import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, type LanguageModelUsage } from "ai";
import { z } from "zod";
import { checkChatRateLimit } from "@/auth/rate-limit";
import { auth } from "@/auth/server";
import { headers } from "next/headers";
import {
	getUserSubscription,
	getUserUsageToday,
	recordTokenUsage,
} from "@/billing/service";
import {
	LIMITS,
	getAvailableModels,
	getFallbackChain,
	getModelById,
	estimateCostUSD,
	Tier,
} from "@/billing/tiers";

// Initialize OpenRouter provider
// The API key is read automatically from process.env.OPENROUTER_API_KEY
// Because it does not have the NEXT_PUBLIC_ prefix, it will never be leaked to the client bundle.
const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
	// Required for OpenRouter free model routing — without these the
	// `:free` suffix models return 402 Payment Required.
	headers: {
		"HTTP-Referer":
			process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamy-blush.vercel.app",
		"X-Title": "Dreamy",
	},
});

// Maximum duration for the serverless function
export const maxDuration = 60;

/**
 * Errors we treat as "try the fallback model" — anything OpenRouter says is
 * transient or per-model rate-limited. Anything else is a real bug.
 */
const FALLBACK_TRIGGER_ERRORS = [
	"429", // rate limited (we or upstream)
	"402", // payment required (free model temporarily out of credits)
	"503", // service unavailable
	"504", // gateway timeout
	"500", // upstream provider error
	"rate limit",
	"rate-limited",
	"too many requests",
	"capacity",
	"overloaded",
];

function shouldFallback(error: unknown): boolean {
	const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
	return FALLBACK_TRIGGER_ERRORS.some((needle) => msg.includes(needle));
}

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
					JSON.stringify({
						error: `Daily limit reached. You've used all ${LIMITS[tier].dailyCommands} commands for today.`,
					}),
					{ status: 403 },
				);
			}
		}

		const { messages, model = "qwen/qwen3-coder:free" } = await req.json();

		const availableModels = getAvailableModels(tier);
		const requestedModel = availableModels.some((m) => m.id === model) ? model : availableModels[0].id;

		// Fallback chain — try requested model first, then fall back to next in chain
		// if it fails with a recoverable error.
		const chain = getFallbackChain(tier, requestedModel).filter((id) =>
			availableModels.some((m) => m.id === id),
		);

		// System prompt shared by all attempts
		const systemPrompt =
			"You are Dreamy Copilot, an AI assistant integrated directly into a video editor. " +
			"You can help the user edit their video by using the provided tools. " +
			"When the user asks you to perform an action (e.g. 'split the first clip at 5 seconds'), " +
			"first use the get_timeline_state tool to understand what elements exist and their IDs, " +
			"then use the appropriate tools to make the edits. Be concise and helpful.";

		const tools = {
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
		};

		let lastError: unknown = null;
		for (let i = 0; i < chain.length; i++) {
			const attemptModel = chain[i];
			const modelInfo = getModelById(attemptModel);
			try {
				const result = streamText({
					model: openrouter(attemptModel),
					messages,
					tools,
					system: systemPrompt,
					// Track real token usage after the stream finishes
					onFinish: async ({ usage }: { usage: LanguageModelUsage }) => {
						if (userId && usage) {
							const promptTokens = usage.promptTokens ?? 0;
							const completionTokens = usage.completionTokens ?? 0;
							const cost = modelInfo
								? estimateCostUSD(modelInfo, promptTokens, completionTokens)
								: 0;
							await recordTokenUsage({
								userId,
								promptTokens,
								completionTokens,
								estimatedCostUsd: cost,
							}).catch((err) => {
								console.error("[Chat API] Failed to record usage:", err);
							});
						}
					},
				});

				// We return the streaming response from the first successful attempt.
				// The fallback loop is for non-streaming errors before the stream starts.
				return result.toDataStreamResponse({
					headers: {
						"X-RateLimit-Remaining": String(remaining),
						"X-Model-Used": attemptModel,
						"X-Fallback-Index": String(i),
					},
				});
			} catch (err) {
				lastError = err;
				console.warn(
					`[Chat API] Model ${attemptModel} failed (attempt ${i + 1}/${chain.length}):`,
					err instanceof Error ? err.message : err,
				);
				if (!shouldFallback(err) || i === chain.length - 1) {
					// Non-recoverable, or we've exhausted the chain
					throw err;
				}
				// Otherwise loop continues with the next model
			}
		}

		// If we get here, every model failed
		throw lastError ?? new Error("All models in fallback chain failed");
	} catch (error) {
		console.error("[Chat API] Error:", error);
		const message = error instanceof Error ? error.message : "Failed to process chat request";
		const status = shouldFallback(error) ? 503 : 500;
		return new Response(JSON.stringify({ error: message }), { status });
	}
}