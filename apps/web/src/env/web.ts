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

	// InstaPay manual payment flow
	NEXT_PUBLIC_INSTAPAY_PHONE: z.string().default("01552859609"),
	NEXT_PUBLIC_INSTAPAY_ACCOUNT_NAME: z.string().default("Dreamy"),
	NEXT_PUBLIC_INSTAPAY_AMOUNT: z.coerce.number().default(250),

	// Admin secret for approving pending payments (keep this private)
	ADMIN_SECRET: z.string().default("dummy_admin_secret"),

	// SMTP for email verification and transactional emails
	SMTP_HOST: z.string().default("smtp.gmail.com"),
	SMTP_PORT: z.coerce.number().default(465),
	SMTP_USER: z.string().default("noreply@example.com"),
	SMTP_PASS: z.string().default("dummy_smtp_pass"),
	SMTP_FROM: z.string().default("Dreamy <noreply@example.com>"),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse(process.env);
