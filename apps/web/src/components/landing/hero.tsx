"use client";

import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
	return (
		<div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
			{/* Aurora gradient background */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div
					className="aurora-blob absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full opacity-25 blur-[100px]"
					style={{ background: "hsl(258, 80%, 62%)" }}
				/>
				<div
					className="aurora-blob-2 absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full opacity-20 blur-[90px]"
					style={{ background: "hsl(295, 70%, 65%)" }}
				/>
				<div
					className="aurora-blob-3 absolute bottom-[10%] left-[30%] h-[350px] w-[600px] rounded-full opacity-15 blur-[120px]"
					style={{ background: "hsl(220, 80%, 65%)" }}
				/>
			</div>

			{/* Content */}
			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
				{/* Badge */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
						<Sparkles className="h-3 w-3" />
						100% browser-based. No uploads. No subscriptions.
					</span>
				</motion.div>

				{/* Headline */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
					className="flex flex-col items-center gap-3"
				>
					<h1 className="text-5xl font-bold tracking-tight md:text-7xl">
						Edit videos that feel
						<br />
						<span
							className="bg-clip-text text-transparent"
							style={{ backgroundImage: "var(--gradient-dreamy)" }}
						>
							like dreams.
						</span>
					</h1>
					<p className="mt-2 max-w-xl text-base font-light tracking-wide text-muted-foreground sm:text-xl">
						A powerful AI video editor that runs entirely in your browser.
						Auto-cut silence, generate captions, and export — privately.
					</p>
				</motion.div>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
					className="flex flex-wrap items-center justify-center gap-4"
				>
					<Link href="/projects">
						<Button size="lg" className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/30">
							Start editing free
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
					<Link href="#features">
						<Button size="lg" variant="outline" className="h-12 px-8 text-base">
							See how it works
						</Button>
					</Link>
				</motion.div>

				{/* Trust indicators */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.35 }}
					className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
				>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-constructive" />
						No account required to start
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-constructive" />
						Privacy-first
					</span>
					<span className="flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-constructive" />
						Works on any device
					</span>
				</motion.div>
			</div>

			<style>{`
				.aurora-blob {
					animation: aurora-float 12s ease-in-out infinite alternate;
				}
				.aurora-blob-2 {
					animation: aurora-float 16s ease-in-out infinite alternate-reverse;
				}
				.aurora-blob-3 {
					animation: aurora-float 20s ease-in-out infinite alternate;
				}
				@keyframes aurora-float {
					0%   { transform: translate(0px, 0px) scale(1); }
					33%  { transform: translate(40px, -30px) scale(1.08); }
					66%  { transform: translate(-20px, 20px) scale(0.96); }
					100% { transform: translate(30px, 10px) scale(1.04); }
				}
			`}</style>
		</div>
	);
}
