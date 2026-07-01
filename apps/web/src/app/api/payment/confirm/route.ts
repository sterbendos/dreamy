import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPendingPayment } from "@/billing/service";
import { z } from "zod";

const confirmSchema = z.object({
	transferReference: z.string().min(3, "Transfer reference is required"),
	senderPhone: z.string().min(10, "Phone number is required"),
});

// Simple in-memory rate limiter: max 3 submissions per user per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(userId: string): { allowed: boolean; retryAfterSeconds: number } {
	const now = Date.now();
	const entry = rateLimitMap.get(userId);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
		};
	}

	entry.count++;
	return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * POST /api/payment/confirm
 * Called when a user submits their InstaPay transfer reference.
 * Creates a pending payment record that an admin will verify and approve.
 *
 * Rate limited: max 3 submissions per user per 10 minutes.
 */
export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Rate limiting per authenticated user
		const { allowed, retryAfterSeconds } = checkRateLimit(session.user.id);
		if (!allowed) {
			return NextResponse.json(
				{
					error: `Too many payment submissions. Please wait ${Math.ceil(retryAfterSeconds / 60)} minute(s) before trying again.`,
				},
				{
					status: 429,
					headers: { "Retry-After": String(retryAfterSeconds) },
				},
			);
		}

		const body = await req.json();
		const parsed = confirmSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.errors[0]?.message ?? "Invalid input" },
				{ status: 400 },
			);
		}

		const { transferReference, senderPhone } = parsed.data;

		const payment = await createPendingPayment({
			userId: session.user.id,
			transferReference,
			senderPhone,
		});

		return NextResponse.json({
			success: true,
			paymentId: payment.id,
			message: "Your payment has been submitted for review. We'll activate your subscription within a few hours.",
		});
	} catch (error) {
		console.error("[Payment Confirm] Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
