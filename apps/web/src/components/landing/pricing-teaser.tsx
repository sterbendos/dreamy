"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingTeaser() {
	const reduce = useReducedMotion();

	return (
		<section className="py-32 lg:py-40 bg-accent/30 border-y border-border/40">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					className="max-w-2xl mx-auto mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-sans font-semibold tracking-tighter text-foreground leading-[1.05] mb-4">
						Simple, transparent pricing.
					</h2>
					<p className="text-base text-muted-foreground leading-relaxed">
						Start editing for free, upgrade when you need more power.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
					<motion.div
						initial={reduce ? false : { opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
						className="p-8 rounded-2xl border border-border bg-card flex flex-col"
					>
						<h3 className="text-2xl font-semibold mb-2">Free</h3>
						<p className="text-muted-foreground mb-6 h-10">Perfect for getting started and trying out Dreamy.</p>
						<div className="text-4xl font-bold tracking-tight mb-8">
							EGP 0 <span className="text-base font-normal text-muted-foreground">/mo</span>
						</div>
						<ul className="space-y-4 mb-8 flex-1">
							{["10 AI commands per day", "Standard video quality export", "Basic subtitles"].map((feature) => (
								<li key={feature} className="flex items-center gap-3">
									<Check className="w-5 h-5 text-primary shrink-0" />
									<span className="text-sm">{feature}</span>
								</li>
							))}
						</ul>
						<Button asChild variant="outline" className="w-full">
							<Link href="/dashboard">Start Free</Link>
						</Button>
					</motion.div>

					<motion.div
						initial={reduce ? false : { opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="p-8 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col relative overflow-hidden"
					>
						<div className="absolute top-0 left-0 w-full h-1 bg-primary" />
						<div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
							Most Popular
						</div>
						<h3 className="text-2xl font-semibold mb-2 text-primary">Pro</h3>
						<p className="text-muted-foreground mb-6 h-10">For creators who need advanced AI power.</p>
						<div className="text-4xl font-bold tracking-tight mb-8">
							EGP 250 <span className="text-base font-normal text-muted-foreground">/mo</span>
							<div className="text-sm font-normal text-muted-foreground mt-1 tracking-normal">≈ $5 USD / month</div>
						</div>
						<ul className="space-y-4 mb-8 flex-1">
							{["200 AI commands per day", "Powered by Claude 3.5 Sonnet", "4K video export", "Advanced styling and animations"].map((feature) => (
								<li key={feature} className="flex items-center gap-3">
									<Check className="w-5 h-5 text-primary shrink-0" />
									<span className="text-sm text-foreground">{feature}</span>
								</li>
							))}
						</ul>
						<div className="flex flex-col gap-2">
							<Button asChild className="w-full">
								<Link href="/pricing">Upgrade to Pro</Link>
							</Button>
							<p className="text-xs text-center text-muted-foreground mt-1">Accepting InstaPay & Credit Cards (Soon)</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
