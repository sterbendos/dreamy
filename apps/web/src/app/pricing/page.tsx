"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleUpgrade = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/payment/create-order", { method: "POST" });
			if (res.ok) {
				const { url } = await res.json();
				window.location.href = url; // Redirect to Kashier
			} else {
				if (res.status === 401) {
					alert("Please sign in first to upgrade.");
				} else {
					console.error("Failed to create order");
					alert("Failed to initiate checkout. Please try again.");
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-4xl py-24">
			<h1 className="text-4xl font-bold text-center mb-4">Pricing</h1>
			<p className="text-muted-foreground text-center mb-12">Upgrade to Pro for more AI commands and advanced models.</p>
			
			<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
				<div className="border border-border/50 rounded-xl p-8 flex flex-col gap-6 bg-card">
					<div>
						<h2 className="text-2xl font-bold">Free</h2>
						<p className="text-muted-foreground">For casual creators.</p>
					</div>
					<div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
					<ul className="flex flex-col gap-3 flex-1 text-sm text-muted-foreground">
						<li>✓ 10 AI commands per day</li>
						<li>✓ Access to standard free models</li>
						<li>✓ Core video editing features</li>
					</ul>
					<Button variant="outline" className="w-full" disabled>Current Plan</Button>
				</div>
				
				<div className="border border-primary/50 rounded-xl p-8 flex flex-col gap-6 bg-primary/5 relative overflow-hidden">
					<div className="absolute top-4 right-4 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">RECOMMENDED</div>
					<div>
						<h2 className="text-2xl font-bold">Pro</h2>
						<p className="text-muted-foreground">For serious editors.</p>
					</div>
					<div className="text-4xl font-bold">~250 EGP<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
					<ul className="flex flex-col gap-3 flex-1 text-sm text-muted-foreground">
						<li><span className="text-primary font-bold">✓ 200 AI commands per day</span></li>
						<li><span className="text-primary font-bold">✓ Claude 3.5 Sonnet + Haiku</span></li>
						<li>✓ Prioritized processing</li>
						<li>✓ Premium support</li>
					</ul>
					<Button onClick={handleUpgrade} disabled={isLoading} className="w-full">
						{isLoading ? "Redirecting to Kashier..." : "Upgrade to Pro"}
					</Button>
				</div>
			</div>
		</div>
	);
}
