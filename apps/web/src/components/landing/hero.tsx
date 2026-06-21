"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
	const reduce = useReducedMotion();

	return (
		<section className="relative min-h-[100dvh] flex items-center overflow-hidden">
			{/* Subtle noise grain over background - inherits from layout's Noise component */}

			<div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

				{/* Left: Editorial copy block */}
				<motion.div
					className="flex flex-col items-start"
					initial={reduce ? false : { opacity: 0, y: 28 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					{/* Status tag */}
					<div className="mb-8 flex items-center gap-2.5">
						<span className="flex h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
						<span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
							Browser-native · Open source
						</span>
					</div>

					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-semibold tracking-tighter leading-[1.02] text-foreground mb-6">
						Edit at the<br />
						speed of{" "}
						<span className="text-primary">thought.</span>
					</h1>

					<p className="text-lg text-muted-foreground leading-relaxed max-w-[40ch] mb-10 font-light">
						Stop fighting the timeline. Just tell Dreamy what to cut, caption, or trim, and watch it happen instantly. Zero video uploads required.
					</p>

					<div className="flex flex-row gap-3 w-full sm:w-auto">
						<Link
							href="/editor"
							className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-md bg-foreground text-background text-sm font-medium transition-all hover:bg-foreground/85 active:scale-[0.98]"
						>
							Start creating
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
								<path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
						<Link
							href="/roadmap"
							className="inline-flex items-center justify-center h-12 px-7 rounded-md border border-border bg-transparent text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:border-border/80"
						>
							See roadmap
						</Link>
					</div>

					{/* Trust line */}
					<p className="mt-8 text-xs text-muted-foreground/50 font-light">
						Rendered locally on your machine · No waiting in cloud queues
					</p>
				</motion.div>

				{/* Right: Editor screenshot */}
				<motion.div
					className="relative hidden lg:block"
					initial={reduce ? false : { opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
				>
					{/* Cobalt glow behind image - the ONE allowed accent touch */}
					<div
						className="absolute -inset-[1px] rounded-xl pointer-events-none"
						style={{
							background: "linear-gradient(135deg, hsl(221,100%,55%,0.15) 0%, transparent 60%)",
						}}
					/>
					<div className="relative rounded-xl overflow-hidden border border-border/60 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
						<Image
							src="/editor-mockup.png"
							alt="Dreamy video editor — transcript-based editing with AI subtitles and multi-track timeline"
							width={1200}
							height={750}
							className="w-full h-auto object-cover"
							priority
						/>
					</div>
				</motion.div>
			</div>

			{/* Bottom border */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-border/30" />
		</section>
	);
}
