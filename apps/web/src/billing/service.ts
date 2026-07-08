import { db } from "@/db";
import { subscriptions, ai_usage, pendingPayments } from "@/db/schema";
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
	const usage = await getUserUsageToday(userId);
	await db.update(ai_usage)
		.set({ count: usage.count + 1 })
		.where(eq(ai_usage.id, usage.id));
};

/**
 * Records actual token usage and estimated cost for one completed AI request.
 * This is called after streamText finishes so we have real token counts from
 * the OpenRouter response — not just message counts.
 */
export const recordTokenUsage = async ({
	userId,
	promptTokens,
	completionTokens,
	estimatedCostUsd,
}: {
	userId: string;
	promptTokens: number;
	completionTokens: number;
	estimatedCostUsd: number;
}) => {
	const usage = await getUserUsageToday(userId);
	const existingCost = parseFloat(usage.estimatedCostUsd || "0");
	const newCost = (existingCost + estimatedCostUsd).toFixed(6);

	await db.update(ai_usage)
		.set({
			count: usage.count + 1,
			promptTokens: (usage.promptTokens ?? 0) + promptTokens,
			completionTokens: (usage.completionTokens ?? 0) + completionTokens,
			estimatedCostUsd: newCost,
			updatedAt: new Date(),
		})
		.where(eq(ai_usage.id, usage.id));
};

/**
 * Creates a pending payment record after a user claims to have sent money via InstaPay.
 * An admin must verify and call activateSubscription() to confirm.
 */
export const createPendingPayment = async ({
	userId,
	transferReference,
	senderPhone,
	amount = 250,
}: {
	userId: string;
	transferReference: string;
	senderPhone: string;
	amount?: number;
}) => {
	// Check if user already has a pending payment to avoid duplicates
	const existing = await db.query.pendingPayments.findFirst({
		where: and(
			eq(pendingPayments.userId, userId),
			eq(pendingPayments.status, "pending"),
		),
	});

	if (existing) {
		// Update the existing pending payment instead of creating a new one
		const [updated] = await db.update(pendingPayments)
			.set({ transferReference, senderPhone, amount, updatedAt: new Date() })
			.where(eq(pendingPayments.id, existing.id))
			.returning();
		return updated;
	}

	const [payment] = await db.insert(pendingPayments).values({
		id: crypto.randomUUID(),
		userId,
		transferReference,
		senderPhone,
		amount,
		status: "pending",
	}).returning();

	return payment;
};

export const getPendingPayment = async (userId: string) => {
	return db.query.pendingPayments.findFirst({
		where: and(
			eq(pendingPayments.userId, userId),
			eq(pendingPayments.status, "pending"),
		),
	});
};

/**
 * Admin-only: activates a user's subscription after verifying their InstaPay transfer.
 */
export const activateSubscription = async ({
	pendingPaymentId,
}: {
	pendingPaymentId: string;
}) => {
	const payment = await db.query.pendingPayments.findFirst({
		where: eq(pendingPayments.id, pendingPaymentId),
	});

	if (!payment) throw new Error("Pending payment not found");
	if (payment.status !== "pending") throw new Error(`Payment is already ${payment.status}`);

	// Mark payment as approved
	await db.update(pendingPayments)
		.set({ status: "approved", updatedAt: new Date() })
		.where(eq(pendingPayments.id, pendingPaymentId));

	// Activate or create subscription for 30 days
	const newEndDate = new Date();
	newEndDate.setDate(newEndDate.getDate() + 30);

	const currentSub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.userId, payment.userId),
	});

	if (currentSub) {
		await db.update(subscriptions)
			.set({
				tier: "pro",
				status: "active",
				currentPeriodEnd: newEndDate,
				paymentReference: payment.transferReference,
				updatedAt: new Date(),
			})
			.where(eq(subscriptions.id, currentSub.id));
	} else {
		await db.insert(subscriptions).values({
			id: crypto.randomUUID(),
			userId: payment.userId,
			tier: "pro",
			status: "active",
			currentPeriodEnd: newEndDate,
			paymentReference: payment.transferReference,
		});
	}

	return { userId: payment.userId, endsAt: newEndDate };
};

export const cancelSubscription = async (userId: string) => {
	const sub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.userId, userId),
	});

	if (!sub) throw new Error("No subscription found");

	await db.update(subscriptions)
		.set({
			status: "cancelled",
			updatedAt: new Date(),
		})
		.where(eq(subscriptions.id, sub.id));

	return { cancelled: true };
};

/**
 * Admin-only: get all pending payment submissions.
 */
export const getAllPendingPayments = async () => {
	return db.query.pendingPayments.findMany({
		where: eq(pendingPayments.status, "pending"),
		orderBy: (table, { desc }) => [desc(table.createdAt)],
	});
};

/**
 * Admin-only: reject a pending payment.
 */
export const rejectPayment = async (pendingPaymentId: string) => {
	const payment = await db.query.pendingPayments.findFirst({
		where: eq(pendingPayments.id, pendingPaymentId),
	});

	if (!payment) throw new Error("Pending payment not found");
	if (payment.status !== "pending") throw new Error(`Payment is already ${payment.status}`);

	await db.update(pendingPayments)
		.set({ status: "rejected", updatedAt: new Date() })
		.where(eq(pendingPayments.id, pendingPaymentId));

	return { rejected: true, userId: payment.userId };
};
