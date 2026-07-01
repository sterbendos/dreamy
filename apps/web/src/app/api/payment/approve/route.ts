import { NextResponse } from "next/server";
import { activateSubscription } from "@/billing/service";
import { webEnv } from "@/env/web";
import { z } from "zod";

const approveSchema = z.object({
	pendingPaymentId: z.string().min(1),
});

/**
 * POST /api/payment/approve
 * Admin-only endpoint to approve a pending InstaPay payment.
 * 
 * Usage:
 *   curl -X POST https://yourdomain.com/api/payment/approve \
 *     -H "x-admin-secret: YOUR_ADMIN_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"pendingPaymentId": "..."}'
 */
export async function POST(req: Request) {
	// Verify admin secret header
	const adminSecret = req.headers.get("x-admin-secret");
	if (!adminSecret || adminSecret !== webEnv.ADMIN_SECRET) {
		return new NextResponse("Forbidden", { status: 403 });
	}

	try {
		const body = await req.json();
		const parsed = approveSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "pendingPaymentId is required" },
				{ status: 400 },
			);
		}

		const result = await activateSubscription({
			pendingPaymentId: parsed.data.pendingPaymentId,
		});

		return NextResponse.json({
			success: true,
			userId: result.userId,
			endsAt: result.endsAt,
			message: `Subscription activated for user ${result.userId} until ${result.endsAt.toISOString()}`,
		});
	} catch (error: any) {
		console.error("[Payment Approve] Error:", error);
		return NextResponse.json(
			{ error: error.message ?? "Internal Server Error" },
			{ status: error.message?.includes("not found") ? 404 : 500 },
		);
	}
}
