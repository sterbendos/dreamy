import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { webEnv } from "@/env/web";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

export const baseRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
	analytics: true,
	prefix: "rate-limit",
});

// Stricter limit for the AI chat endpoint — each request costs real money.
// 20 messages per 10 minutes per IP.
export const chatRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, "10 m"),
	analytics: true,
	prefix: "chat-rate-limit",
});

export async function checkRateLimit({ request }: { request: Request }) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = await baseRateLimit.limit(ip);
	return { success, limited: !success };
}

export async function checkChatRateLimit({ request }: { request: Request }) {
	const ip =
		request.headers.get("x-forwarded-for") ??
		request.headers.get("x-real-ip") ??
		"anonymous";
	const { success, reset, remaining } = await chatRateLimit.limit(ip);
	const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
	return { success, limited: !success, remaining, retryAfterSeconds };
}
