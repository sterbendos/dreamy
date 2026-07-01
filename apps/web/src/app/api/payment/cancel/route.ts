import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { cancelSubscription } from "@/billing/service";

/**
 * POST /api/payment/cancel
 * Cancels the user's Pro subscription. Keeps access active until currentPeriodEnd.
 */
export async function POST() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		await cancelSubscription(session.user.id);

		return NextResponse.json({
			success: true,
			message: "Your subscription has been cancelled. You will retain Pro access until the end of your billing period.",
		});
	} catch (error) {
		console.error("[Payment Cancel] Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}