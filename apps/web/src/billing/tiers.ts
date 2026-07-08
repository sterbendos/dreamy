export type Tier = "free" | "pro";

export const LIMITS = {
	free: {
		dailyCommands: 10,
	},
	pro: {
		dailyCommands: 200,
	},
};

export type ModelTier = "free" | "pro";
export type ModelFamily = "claude" | "deepseek" | "qwen" | "llama" | "mistral" | "gemma" | "nemotron";

export interface ModelInfo {
	id: string;
	name: string;
	provider: string;
	contextWindow: number;     // in tokens
	maxOutputTokens: number;    // in tokens
	family: ModelFamily;
	tier: ModelTier;
	strength: string;            // one-line description
	costPer1MTokens?: string;    // e.g. "$0.80 in / $4 out" — undefined for free models
	qualityScore: number;        // 0-100, rough quality estimate for sorting
}

/**
 * Curated OpenRouter model catalog.
 *
 * FREE tier: only models with `:free` suffix — OpenRouter routes these through
 * providers that pay for inference, so they cost us $0 regardless of our API key.
 * We add `HTTP-Referer` / `X-Title` headers in the chat route to ensure free
 * routing doesn't return 402.
 *
 * PRO tier: cheap-but-strong paid models. Specifically excludes Claude Sonnet
 * / Opus because a single Pro user at 200 commands/day could cost us $5-10/mo
 * at Sonnet pricing. Claude 3.5 Haiku, DeepSeek V3, and Llama 3.3 70B give
 * near-frontier quality at sub-$1/mo per user worst case.
 *
 * Every model id here has been verified working on OpenRouter as of July 2026.
 */
export const MODELS: ModelInfo[] = [
	// ── Free tier (always shown, no `:free` models on Pro) ───────────────────
	{
		id: "qwen/qwen3-coder:free",
		name: "Qwen 3 Coder",
		provider: "Alibaba",
		contextWindow: 1_000_000,
		maxOutputTokens: 32_000,
		family: "qwen",
		tier: "free",
		strength: "Best free coding model — strong for editing commands and tool use",
		qualityScore: 72,
	},
	{
		id: "deepseek/deepseek-chat-v3:free",
		name: "DeepSeek V3",
		provider: "DeepSeek",
		contextWindow: 128_000,
		maxOutputTokens: 8_000,
		family: "deepseek",
		tier: "free",
		strength: "Strong all-rounder, great for natural language + tool use",
		qualityScore: 70,
	},
	{
		id: "meta-llama/llama-3.3-70b-instruct:free",
		name: "Llama 3.3 70B",
		provider: "Meta",
		contextWindow: 128_000,
		maxOutputTokens: 4_000,
		family: "llama",
		tier: "free",
		strength: "Solid general-purpose, well-supported, fast",
		qualityScore: 64,
	},
	{
		id: "mistralai/mistral-small-3.1-24b-instruct:free",
		name: "Mistral Small 3.1",
		provider: "Mistral",
		contextWindow: 128_000,
		maxOutputTokens: 4_000,
		family: "mistral",
		tier: "free",
		strength: "Balanced speed + smarts, EU-hosted alternative",
		qualityScore: 60,
	},
	{
		id: "google/gemma-3-12b-it:free",
		name: "Gemma 3 12B",
		provider: "Google",
		contextWindow: 128_000,
		maxOutputTokens: 4_000,
		family: "gemma",
		tier: "free",
		strength: "Google's safety-tuned model — efficient, reliable",
		qualityScore: 55,
	},
	{
		id: "meta-llama/llama-4-scout:free",
		name: "Llama 4 Scout",
		provider: "Meta",
		contextWindow: 10_000_000,
		maxOutputTokens: 8_000,
		family: "llama",
		tier: "free",
		strength: "Largest context — 10M tokens. Use for huge transcripts.",
		qualityScore: 58,
	},

	// ── Pro tier (cheap paid models only) ───────────────────────────────────
	{
		id: "anthropic/claude-3.5-haiku",
		name: "Claude 3.5 Haiku",
		provider: "Anthropic",
		contextWindow: 200_000,
		maxOutputTokens: 8_000,
		family: "claude",
		tier: "pro",
		strength: "Best $/$ smarts in Pro tier — fast, capable, reliable",
		costPer1MTokens: "$0.80 in / $4 out",
		qualityScore: 82,
	},
	{
		id: "deepseek/deepseek-chat-v3",
		name: "DeepSeek V3",
		provider: "DeepSeek",
		contextWindow: 128_000,
		maxOutputTokens: 8_000,
		family: "deepseek",
		tier: "pro",
		strength: "Near-frontier quality at the lowest cost",
		costPer1MTokens: "$0.14 in / $0.28 out",
		qualityScore: 85,
	},
	{
		id: "meta-llama/llama-3.3-70b-instruct",
		name: "Llama 3.3 70B",
		provider: "Meta",
		contextWindow: 128_000,
		maxOutputTokens: 4_000,
		family: "llama",
		tier: "pro",
		strength: "Quality open-weights model with fast inference",
		costPer1MTokens: "$0.59 in / $0.79 out",
		qualityScore: 76,
	},
];

export function getAvailableModels(tier: Tier): ModelInfo[] {
	return MODELS.filter((m) => m.tier === tier).sort((a, b) => b.qualityScore - a.qualityScore);
}

export function getModelById(id: string): ModelInfo | undefined {
	return MODELS.find((m) => m.id === id);
}

/** Friendly context-window label: 128000 -> "128K", 1000000 -> "1M" */
export function formatContextWindow(tokens: number): string {
	if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`;
	if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`;
	return String(tokens);
}

/** USD cost per 1M tokens, parsed from costPer1MTokens string like "$0.80 in / $4 out". */
export interface PricingRate {
	inputPer1M: number;
	outputPer1M: number;
}

export function getModelPricing(model: ModelInfo): PricingRate {
	if (!model.costPer1MTokens) return { inputPer1M: 0, outputPer1M: 0 };
	// Parse "$0.80 in / $4 out" -> { inputPer1M: 0.8, outputPer1M: 4 }
	const match = model.costPer1MTokens.match(/\$([0-9.]+)\s*in\s*\/\s*\$([0-9.]+)\s*out/i);
	if (!match) return { inputPer1M: 0, outputPer1M: 0 };
	return {
		inputPer1M: parseFloat(match[1]),
		outputPer1M: parseFloat(match[2]),
	};
}

/** Estimate USD cost for a request given token counts. */
export function estimateCostUSD(
	model: ModelInfo,
	promptTokens: number,
	completionTokens: number,
): number {
	const pricing = getModelPricing(model);
	return (
		(promptTokens / 1_000_000) * pricing.inputPer1M +
		(completionTokens / 1_000_000) * pricing.outputPer1M
	);
}

/**
 * Fallback chain for free models.
 * If the primary model fails (e.g. OpenRouter per-model rate limit, 429, 5xx),
 * the chat route will try these in order.
 *
 * Order: best quality first, since most requests succeed on the first try.
 * We fall back to more conservative models that usually have higher availability.
 */
export const FREE_FALLBACK_CHAIN: string[] = [
	"qwen/qwen3-coder:free",         // 1M context, best for editing commands
	"deepseek/deepseek-chat-v3:free", // strong all-rounder
	"meta-llama/llama-3.3-70b-instruct:free", // well-supported
	"mistralai/mistral-small-3.1-24b-instruct:free", // EU hosted, often available
	"google/gemma-3-12b-it:free",    // last resort, smaller but reliable
];

/**
 * Fallback chain for Pro models.
 * DeepSeek V3 (paid) is first because it's the cheapest and very capable.
 * Claude Haiku is the premium option — if it fails, fall back to DeepSeek.
 */
export const PRO_FALLBACK_CHAIN: string[] = [
	"anthropic/claude-3.5-haiku",      // premium, fastest
	"deepseek/deepseek-chat-v3",       // cheap alternative
	"meta-llama/llama-3.3-70b-instruct", // open weights fallback
];

export function getFallbackChain(tier: Tier, primaryModel: string): string[] {
	const chain = tier === "pro" ? PRO_FALLBACK_CHAIN : FREE_FALLBACK_CHAIN;
	// Put primary first (if it's in the chain), then the rest, deduped
	const rest = chain.filter((id) => id !== primaryModel);
	return primaryModel ? [primaryModel, ...rest] : chain;
}