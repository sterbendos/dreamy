import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPendingPayment } from "@/billing/service";
import { z } from "zod";

const confirmSchema = z.object({
	transferReference: z.string().min(3, "Transfer reference is required"),
	senderPhone: z.string().min(10, "Phone number is required"),
});

/**
 * POST /api/payment/confirm
 * Called when a user submits their InstaPay transfer reference.
 * Creates a pending payment record that an admin will verify and approve.
 */
export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return new NextResponse("Unauthorized", { status: 401 });
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
