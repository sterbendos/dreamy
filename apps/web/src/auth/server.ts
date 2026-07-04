import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { db } from "@/db";
import { webEnv } from "@/env/web";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

const resend = new Resend(webEnv.RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
	secret: webEnv.BETTER_AUTH_SECRET,
	user: {
		deleteUser: {
			enabled: true,
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			try {
				const { error } = await resend.emails.send({
					from: webEnv.RESEND_FROM,
					to: user.email,
					subject: "Verify your Dreamy account",
					html: `
						<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #ededed; border-radius: 16px;">
							<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #fff;">Verify your email</h2>
							<p style="color: #9ca3af; margin-bottom: 24px; line-height: 1.6;">
								Thanks for signing up for Dreamy! Click the button below to verify your email address and activate your account.
							</p>
							<a href="${url}" style="display: inline-block; background: #fff; color: #000; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 15px;">
								Verify Email →
							</a>
							<p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
								If you didn't create a Dreamy account, you can safely ignore this email.
							</p>
						</div>
					`,
				});
				if (error) {
					console.error("[Resend Error]:", error);
				}
			} catch (e) {
				console.error("[Resend Exception]:", e);
			}
		},
	},
	rateLimit: {
		storage: "secondary-storage",
		customStorage: {
			get: async (key) => {
				try {
					const value = await redis.get(key);
					return value as RateLimit | undefined;
				} catch (e) {
					console.error("[Redis Get Error]:", e);
					return undefined;
				}
			},
			set: async (key, value) => {
				try {
					await redis.set(key, value);
				} catch (e) {
					console.error("[Redis Set Error]:", e);
				}
			},
		},
	},
	baseURL: webEnv.NEXT_PUBLIC_SITE_URL,
	appName: "Dreamy",
	trustedOrigins: [
		webEnv.NEXT_PUBLIC_SITE_URL,
		process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
		process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined
	].filter(Boolean) as string[],
});

export type Auth = typeof auth;
