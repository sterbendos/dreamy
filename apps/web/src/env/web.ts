import { z } from "zod";

const webEnvSchema = z.object({
	// Node
	NODE_ENV: z.enum(["development", "production", "test"]),
	ANALYZE: z.string().optional(),
	NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),

	// Public
	NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
	NEXT_PUBLIC_MARBLE_API_URL: z.string().default("https://api.marblecms.com"),

	// Server
	DATABASE_URL: z.string().default("postgres://dummy:dummy@localhost:5432/dummy"),

	BETTER_AUTH_SECRET: z.string().default("dummy_secret"),
	UPSTASH_REDIS_REST_URL: z.string().default("https://dummy.upstash.io"),
	UPSTASH_REDIS_REST_TOKEN: z.string().default("dummy_token"),
	MARBLE_WORKSPACE_KEY: z.string().default("dummy_key"),
	FREESOUND_CLIENT_ID: z.string().default("dummy_id"),
	FREESOUND_API_KEY: z.string().default("dummy_key"),
	
	// Kashier
	KASHIER_API_KEY: z.string().default("dummy_kashier_api_key"),
	KASHIER_MERCHANT_ID: z.string().default("dummy_kashier_merchant_id"),
	KASHIER_WEBHOOK_SECRET: z.string().default("dummy_kashier_webhook_secret"),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse(process.env);
