"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StatusData {
	tier: "free" | "pro";
	subscription: {
		currentPeriodEnd?: string;
		status: string;
	} | null;
	usageToday: number;
	dailyLimit: number;
	pendingPayment: {
		id: string;
		status: string;
		createdAt: string;
	} | null;
}

export default function AccountPage() {
	const [data, setData] = useState<StatusData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetch("/api/payment/status")
			.then((res) => {
				if (res.status === 401) {
					router.push("/");
					return null;
				}
				return res.json();
			})
			.then((d) => {
				if (d) setData(d);
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
	}, [router]);

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-3xl py-24 px-4">
				<div className="animate-pulse space-y-4">
					<div className="h-10 bg-muted rounded-xl w-1/3" />
					<div className="h-40 bg-muted rounded-2xl" />
					<div className="h-32 bg-muted rounded-2xl" />
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="container mx-auto max-w-3xl py-24 px-4 text-center text-muted-foreground">
				Failed to load account details.
			</div>
		);
	}

	const { tier, subscription, usageToday, dailyLimit, pendingPayment } = data;
	const isPro = tier === "pro";
	const usagePercent = Math.min((usageToday / dailyLimit) * 100, 100);

	return (
		<div className="container mx-auto max-w-3xl py-24 px-4">
			<h1 className="text-4xl font-bold mb-10">Account & Billing</h1>

			{/* ── Plan Card ── */}
			<div className="border border-border/50 rounded-2xl p-6 bg-card mb-6">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h2 className="text-lg font-bold">
							Current Plan:{" "}
							<span className={`${isPro ? "text-primary" : "text-muted-foreground"} uppercase`}>
								{tier}
							</span>
						</h2>
						{isPro && subscription?.currentPeriodEnd && (
							<p className="text-sm text-muted-foreground mt-1">
								Active until {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-EG", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						)}
					</div>
					{isPro && (
						<span className="text-xs font-semibold bg-primary/15 text-primary border border-primary/25 px-2.5 py-1 rounded-full">
							PRO
						</span>
					)}
				</div>

				{/* Pending payment status */}
				{pendingPayment && !isPro && (
					<div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
						<p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
							⏳ Payment under review
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Your InstaPay payment is being verified. Submitted on{" "}
							{new Date(pendingPayment.createdAt).toLocaleDateString()}. Typically activates within a few hours.
						</p>
					</div>
				)}

				{!isPro && !pendingPayment && (
					<div>
						<p className="text-sm text-muted-foreground mb-4">
							You're on the free plan with {dailyLimit} AI commands per day.
						</p>
						<Button onClick={() => router.push("/pricing")}>Upgrade to Pro — 250 EGP/mo</Button>
					</div>
				)}
			</div>

			{/* ── Usage Card ── */}
			<div className="border border-border/50 rounded-2xl p-6 bg-card">
				<h2 className="text-lg font-bold mb-4">AI Usage Today</h2>

				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-muted-foreground">Commands used</span>
					<span className="text-sm font-bold tabular-nums">
						{usageToday} / {dailyLimit}
					</span>
				</div>

				<div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mb-3">
					<div
						className={`h-full rounded-full transition-all duration-500 ${
							usageToday >= dailyLimit ? "bg-destructive" : "bg-primary"
						}`}
						style={{ width: `${usagePercent}%` }}
					/>
				</div>

				{usageToday >= dailyLimit && (
					<p className="text-xs text-destructive">
						{isPro
							? "You've reached your daily limit. Resets at midnight."
							: "Daily limit reached. Upgrade to Pro for 200 commands/day."}
					</p>
				)}
			</div>
		</div>
	);
}
