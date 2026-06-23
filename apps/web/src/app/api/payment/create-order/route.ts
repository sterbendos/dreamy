import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createKashierOrder } from "@/billing/kashier";

export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Create a unique order ID for this transaction
		const orderId = `order_${session.user.id}_${Date.now()}`;
		const amount = 250; // Approx 5 USD -> EGP

		// We assume creating the kashier order just generates the hosted payment URL
		const url = await createKashierOrder({
			orderId,
			amount,
			currency: "EGP",
		});

		return NextResponse.json({ url });
	} catch (error) {
		console.error("[Payment API] Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
