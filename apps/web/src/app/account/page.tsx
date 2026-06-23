"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccountPage() {
	const [data, setData] = useState<any>(null);
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
				if (d) {
					setData(d);
				}
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
	}, [router]);

	if (isLoading) return <div className="p-24 text-center">Loading account details...</div>;
	if (!data) return <div className="p-24 text-center">Failed to load account details.</div>;

	const { tier, subscription, usageToday, dailyLimit } = data;
	const isPro = tier === "pro";

	return (
		<div className="container mx-auto max-w-3xl py-24">
			<h1 className="text-4xl font-bold mb-8">Account & Billing</h1>
			
			<div className="border border-border/50 rounded-xl p-6 bg-card mb-8">
				<h2 className="text-xl font-bold mb-4">Current Plan: <span className="uppercase text-primary">{tier}</span></h2>
				
				{isPro && subscription?.currentPeriodEnd && (
					<p className="text-sm text-muted-foreground mb-4">
						Your subscription is active until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
					</p>
				)}

				{!isPro && (
					<div className="mb-4">
						<p className="text-sm text-muted-foreground mb-4">You are on the free plan with limited AI commands.</p>
						<Button onClick={() => router.push("/pricing")}>Upgrade to Pro</Button>
					</div>
				)}
			</div>

			<div className="border border-border/50 rounded-xl p-6 bg-card">
				<h2 className="text-xl font-bold mb-4">AI Usage Today</h2>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-muted-foreground">Commands used</span>
					<span className="text-sm font-bold">{usageToday} / {dailyLimit}</span>
				</div>
				<div className="w-full bg-muted rounded-full h-2.5">
					<div 
						className={`h-2.5 rounded-full ${usageToday >= dailyLimit ? "bg-destructive" : "bg-primary"}`} 
						style={{ width: `${Math.min((usageToday / dailyLimit) * 100, 100)}%` }}
					></div>
				</div>
				{usageToday >= dailyLimit && (
					<p className="text-xs text-destructive mt-4">You have reached your daily limit. {isPro ? "Please try again tomorrow." : "Upgrade to Pro to get 200 commands per day."}</p>
				)}
			</div>
		</div>
	);
}
