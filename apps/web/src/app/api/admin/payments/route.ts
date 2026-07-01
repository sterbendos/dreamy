import { NextResponse } from "next/server";
import { getAllPendingPayments } from "@/billing/service";
import { webEnv } from "@/env/web";

/**
 * GET /api/admin/payments
 * Admin-only: returns all pending payment submissions for review.
 */
export async function GET(req: Request) {
	const adminSecret = req.headers.get("x-admin-secret");
	if (!adminSecret || adminSecret !== webEnv.ADMIN_SECRET) {
		return new NextResponse("Forbidden", { status: 403 });
	}

	try {
		const payments = await getAllPendingPayments();
		return NextResponse.json({ payments });
	} catch (error) {
		console.error("[Admin Payments] Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
