import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "@upstash/redis";
import { db } from "@/db";
import { webEnv } from "@/env/web";
import nodemailer from "nodemailer";

const redis = new Redis({
	url: webEnv.UPSTASH_REDIS_REST_URL,
	token: webEnv.UPSTASH_REDIS_REST_TOKEN,
});

// SMTP transporter for sending verification and auth emails
const transporter = nodemailer.createTransport({
	host: webEnv.SMTP_HOST,
	port: webEnv.SMTP_PORT,
	secure: webEnv.SMTP_PORT === 465,
	auth: {
		user: webEnv.SMTP_USER,
		pass: webEnv.SMTP_PASS,
	},
});

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
		requireEmailVerification: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await transporter.sendMail({
				from: webEnv.SMTP_FROM,
				to: user.email,
				subject: "Verify your Dreamy account",
				html: `
					<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
						<h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Verify your email</h2>
						<p style="color: #6b7280; margin-bottom: 24px;">
							Thanks for signing up for Dreamy! Click the link below to verify your email address and activate your account.
						</p>
						<a href="${url}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
							Verify Email
						</a>
						<p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
							If you didn't create a Dreamy account, you can safely ignore this email.
						</p>
					</div>
				`,
			});
		},
	},
	rateLimit: {
		storage: "secondary-storage",
		customStorage: {
			get: async (key) => {
				const value = await redis.get(key);
				return value as RateLimit | undefined;
			},
			set: async (key, value) => {
				await redis.set(key, value);
			},
		},
	},
	baseURL: webEnv.NEXT_PUBLIC_SITE_URL,
	appName: "Dreamy",
	trustedOrigins: [webEnv.NEXT_PUBLIC_SITE_URL],
});

export type Auth = typeof auth;
