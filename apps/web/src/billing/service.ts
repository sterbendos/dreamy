import { db } from "@/db";
import { subscriptions, ai_usage } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Tier, LIMITS } from "./tiers";

export const getUserSubscription = async (userId: string) => {
	const sub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.userId, userId),
	});

	let tier: Tier = "free";
	if (sub && sub.status === "active" && sub.currentPeriodEnd && new Date() < sub.currentPeriodEnd) {
		tier = "pro";
	}

	return { tier, subscription: sub };
};

export const getUserUsageToday = async (userId: string) => {
	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	let usage = await db.query.ai_usage.findFirst({
		where: and(eq(ai_usage.userId, userId), eq(ai_usage.date, today)),
	});

	if (!usage) {
		// Create the usage record if it doesn't exist
		[usage] = await db.insert(ai_usage).values({
			id: crypto.randomUUID(),
			userId,
			date: today,
			count: 0,
		}).returning();
	}

	return usage;
};

export const incrementUserUsage = async (userId: string) => {
	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	// We use raw update or just fetch and update
	const usage = await getUserUsageToday(userId);
	await db.update(ai_usage)
		.set({ count: usage.count + 1 })
		.where(eq(ai_usage.id, usage.id));
};
