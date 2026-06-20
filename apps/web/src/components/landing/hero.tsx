"use client";

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
	return (
		<div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
			{/* Content */}
			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
				{/* Headline */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="flex flex-col items-center gap-6"
				>
					<h1 className="font-serif text-6xl font-light leading-[1.1] tracking-tight md:text-8xl text-foreground">
						Edit videos that feel
						<br />
						<span className="italic text-primary">
							like dreams.
						</span>
					</h1>
					<p className="mt-4 max-w-2xl text-lg font-light tracking-wide text-muted-foreground/80 md:text-2xl leading-relaxed">
						A powerful AI video editor that runs entirely in your browser.
						Auto-cut silence, generate captions, and export — privately.
					</p>
				</motion.div>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
					className="flex flex-col items-center justify-center gap-6 pt-4"
				>
					<Link href="/projects">
						<Button size="lg" className="h-14 gap-2 rounded-full px-10 text-lg font-medium shadow-sm hover:scale-[1.02] transition-transform">
							Start editing free
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
