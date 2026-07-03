import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Redis } from "@upstash/redis";
import { webEnv } from "@/env/web";

export const dynamic = "force-dynamic";

export async function GET() {
	const results: Record<string, any> = {
		timestamp: new Date().toISOString(),
		env: {
			NODE_ENV: process.env.NODE_ENV,
			NEXT_PUBLIC_SITE_URL: webEnv.NEXT_PUBLIC_SITE_URL,
			DATABASE_URL_SET: !!process.env.DATABASE_URL,
			UPSTASH_REDIS_SET: !!process.env.UPSTASH_REDIS_REST_URL,
			RESEND_KEY_SET: !!process.env.RESEND_API_KEY,
		},
		db: null,
		redis: null,
		tables: null,
	};

	// 1. Test Database Connection
	try {
		await db.execute(sql`SELECT 1`);
		results.db = "Connected successfully";
	} catch (e: any) {
		results.db = { error: e.message, stack: e.stack, name: e.name };
	}

	// 2. Test Tables Exist
	if (results.db === "Connected successfully") {
		try {
			await db.select().from(user).limit(1);
			results.tables = "User table exists";
		} catch (e: any) {
			results.tables = { error: e.message, stack: e.stack, name: e.name };
		}
	}

	// 3. Test Redis Connection
	try {
		const redis = new Redis({
			url: webEnv.UPSTASH_REDIS_REST_URL,
			token: webEnv.UPSTASH_REDIS_REST_TOKEN,
		});
		await redis.set("health_check_test", "ok", { ex: 10 });
		const val = await redis.get("health_check_test");
		results.redis = val === "ok" ? "Connected successfully" : `Failed: returned ${val}`;
	} catch (e: any) {
		results.redis = { error: e.message, stack: e.stack, name: e.name };
	}

	return NextResponse.json(results, { status: 200 });
}
