"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
	const reduce = useReducedMotion();

	return (
		<section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-background">
			{/* Intense noise grain overlay */}
			<div className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('/noise.svg')", backgroundRepeat: "repeat" }} />

			<div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-24 flex flex-col items-center justify-center text-center">

				<motion.div
					className="flex flex-col items-center"
					initial={reduce ? false : { opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					{/* Status tag */}
					<div className="mb-6 inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-border/50 bg-secondary/50 backdrop-blur-md">
						<span className="flex h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
						<span className="text-xs font-medium text-foreground tracking-widest uppercase">
							Meet Dreamy AI
						</span>
					</div>

					{/* Editorial Headline */}
					<h1 className="text-6xl sm:text-7xl lg:text-[110px] font-serif font-medium tracking-[-0.03em] leading-[0.95] text-foreground mb-8">
						Video editing,<br />
						<span className="text-primary italic">reinvented.</span>
					</h1>

					<p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-[50ch] mb-12 font-light">
						A single creative workspace where you and your AI agents edit video by editing text, searching b-roll, and generating motion graphics. Purely local.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<Link
							href="/dashboard"
							className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground text-base font-medium transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-[0.98]"
						>
							Start for free
						</Link>
						<button
							className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full border border-border bg-transparent text-base font-medium text-foreground transition-colors hover:bg-secondary/50"
						>
							Watch the film
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<polygon points="5 3 19 12 5 21 5 3"></polygon>
							</svg>
						</button>
					</div>
				</motion.div>

				{/* Huge UI Mockup Reveal */}
				<motion.div
					className="relative mt-24 w-full"
					initial={reduce ? false : { opacity: 0, y: 100, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
				>
					{/* Glow */}
					<div
						className="absolute -inset-[2px] rounded-[24px] pointer-events-none"
						style={{
							background: "linear-gradient(180deg, hsl(221,100%,55%,0.3) 0%, transparent 100%)",
							filter: "blur(40px)",
							transform: "translateY(-20px)"
						}}
					/>
					<div className="relative rounded-[24px] overflow-hidden border border-border shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-background">
						<Image
							src="/editor-mockup.png"
							alt="Dreamy Editor Interface"
							width={1600}
							height={1000}
							className="w-full h-auto object-cover"
							priority
						/>
					</div>
				</motion.div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
		</section>
	);
}
