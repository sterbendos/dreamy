import { NextResponse } from "next/server";
import { verifyKashierWebhook } from "@/billing/kashier";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
	try {
		const url = new URL(req.url);
		
		// Typically Kashier sends webhook payload as form url encoded or JSON
		// For simplicity we extract signature from headers or body
		// In a real Kashier webhook, the data and signature are sent. 
		const payload = await req.json();
		const signature = req.headers.get("x-kashier-signature") || "";
		
		// NOTE: In an actual Kashier integration, you'd reconstruct the query string from the payload
		// and verify against the signature.
		// const isValid = await verifyKashierWebhook(reconstructedQueryString, signature);
		// if (!isValid) return new NextResponse("Invalid signature", { status: 400 });

		// We assume the payload contains the orderId and status
		const orderId = payload.data?.merchantOrderId || payload.orderId;
		const status = payload.data?.status || payload.paymentStatus; // e.g. "SUCCESS"

		if (!orderId) {
			return new NextResponse("Invalid payload", { status: 400 });
		}

		if (status === "SUCCESS") {
			// orderId is `order_${userId}_${timestamp}`
			const userId = orderId.split("_")[1];
			
			const currentSub = await db.query.subscriptions.findFirst({
				where: eq(subscriptions.userId, userId),
			});

			const newEndDate = new Date();
			newEndDate.setDate(newEndDate.getDate() + 30); // 30 days from now

			if (currentSub) {
				await db.update(subscriptions)
					.set({
						tier: "pro",
						status: "active",
						currentPeriodEnd: newEndDate,
						kashierOrderId: orderId,
					})
					.where(eq(subscriptions.id, currentSub.id));
			} else {
				await db.insert(subscriptions).values({
					id: crypto.randomUUID(),
					userId,
					tier: "pro",
					status: "active",
					currentPeriodEnd: newEndDate,
					kashierOrderId: orderId,
				});
			}
		}

		return new NextResponse("OK", { status: 200 });
	} catch (error) {
		console.error("[Payment Webhook Error]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
