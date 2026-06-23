export type Tier = "free" | "pro";

export const LIMITS = {
	free: {
		dailyCommands: 10,
	},
	pro: {
		dailyCommands: 200,
	},
};

export const MODELS = {
	free: [
		{ id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B" },
		{ id: "google/gemma-7b-it:free", name: "Gemma 7B" },
		{ id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" },
	],
	pro: [
		{ id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
		{ id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
		{ id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B" },
		{ id: "google/gemma-7b-it:free", name: "Gemma 7B" },
		{ id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" },
	],
};

export const getAvailableModels = (tier: Tier) => {
	return MODELS[tier] || MODELS.free;
};
