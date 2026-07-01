import { NextResponse } from "next/server";
import { rejectPayment } from "@/billing/service";
import { webEnv } from "@/env/web";
import { z } from "zod";

const rejectSchema = z.object({
	pendingPaymentId: z.string().min(1),
});

/**
 * POST /api/payment/reject
 * Admin-only endpoint to reject a pending InstaPay payment.
 */
export async function POST(req: Request) {
	const adminSecret = req.headers.get("x-admin-secret");
	if (!adminSecret || adminSecret !== webEnv.ADMIN_SECRET) {
		return new NextResponse("Forbidden", { status: 403 });
	}

	try {
		const body = await req.json();
		const parsed = rejectSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "pendingPaymentId is required" },
				{ status: 400 },
			);
		}

		const result = await rejectPayment(parsed.data.pendingPaymentId);

		return NextResponse.json({
			success: true,
			userId: result.userId,
			message: `Payment rejected for user ${result.userId}`,
		});
	} catch (error: any) {
		console.error("[Payment Reject] Error:", error);
		return NextResponse.json(
			{ error: error.message ?? "Internal Server Error" },
			{ status: error.message?.includes("not found") ? 404 : 500 },
		);
	}
}
