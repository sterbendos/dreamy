import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getUserSubscription, getUserUsageToday } from "@/billing/service";
import { LIMITS } from "@/billing/tiers";

export async function GET(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { tier, subscription } = await getUserSubscription(session.user.id);
		const usage = await getUserUsageToday(session.user.id);

		return NextResponse.json({
			tier,
			subscription,
			usageToday: usage.count,
			dailyLimit: LIMITS[tier].dailyCommands,
		});
	} catch (error) {
		console.error("[Payment Status API Error]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
