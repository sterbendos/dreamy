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
	emailVerified: boolean;
}

export default function AccountPage() {
	const [data, setData] = useState<StatusData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCancelling, setIsCancelling] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const router = useRouter();

	useEffect(() => {
		fetch("/api/payment/status")
			.then((res) => {
				if (res.status === 401) {
					router.push("/login?returnTo=/account");
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

	const { tier, subscription, usageToday, dailyLimit, pendingPayment, emailVerified } = data;
	const isPro = tier === "pro";
	const usagePercent = Math.min((usageToday / dailyLimit) * 100, 100);

	const handleCancelSubscription = async () => {
		setIsCancelling(true);
		try {
			const res = await fetch("/api/payment/cancel", { method: "POST" });
			if (res.ok) {
				setShowCancelConfirm(false);
				router.refresh();
			}
		} finally {
			setIsCancelling(false);
		}
	};

	return (
		<div className="container mx-auto max-w-3xl py-24 px-4">
			<h1 className="text-4xl font-bold mb-10">Account & Billing</h1>

			{/* Email verification warning */}
			{!emailVerified && (
				<div className="border border-amber-500/30 bg-amber-500/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
					<div className="text-amber-500 mt-0.5">⚠️</div>
					<div>
						<p className="text-sm font-medium text-amber-600 dark:text-amber-400">Please verify your email</p>
						<p className="text-xs text-muted-foreground mt-1">
							Check your inbox for a verification link. If you didn&apos;t receive one, check your spam folder.
						</p>
					</div>
				</div>
			)}

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
						{isPro && subscription?.status === "cancelled" && (
							<p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
								Subscription cancelled. Access ends on{" "}
								{subscription.currentPeriodEnd
									? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-EG", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})
									: "N/A"}
							</p>
						)}
					</div>
					{isPro && subscription?.status !== "cancelled" && (
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
							You&apos;re on the free plan with {dailyLimit} AI commands per day.
						</p>
						<Button onClick={() => router.push("/pricing")}>Upgrade to Pro — 250 EGP/mo</Button>
					</div>
				)}

				{/* Cancel subscription */}
				{isPro && subscription?.status !== "cancelled" && (
					<div className="mt-4 pt-4 border-t border-border/50">
						{showCancelConfirm ? (
							<div className="flex flex-col gap-3">
								<p className="text-sm text-muted-foreground">
									Are you sure? You&apos;ll lose Pro access at the end of your billing period.
								</p>
								<div className="flex gap-2">
									<Button
										variant="destructive"
										size="sm"
										onClick={handleCancelSubscription}
										disabled={isCancelling}
									>
										{isCancelling ? "Cancelling…" : "Yes, cancel"}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowCancelConfirm(false)}
										disabled={isCancelling}
									>
										Keep subscription
									</Button>
								</div>
							</div>
						) : (
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-destructive"
								onClick={() => setShowCancelConfirm(true)}
							>
								Cancel Subscription
							</Button>
						)}
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
							? "You&apos;ve reached your daily limit. Resets at midnight."
							: "Daily limit reached. Upgrade to Pro for 200 commands/day."}
					</p>
				)}
			</div>
		</div>
	);
}
