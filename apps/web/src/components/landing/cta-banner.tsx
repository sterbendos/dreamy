"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

export function CtaBanner() {
	const reduce = useReducedMotion();

	return (
		<section className="relative py-32 lg:py-48 border-t border-border/40 overflow-hidden">
			{/* Single, subtle cobalt glow — not a pulsing orb, just ambiance */}
			<div
				className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[240px] rounded-full opacity-[0.06]"
				style={{ background: "radial-gradient(ellipse, hsl(221,100%,55%), transparent 70%)" }}
			/>

			<div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
				<motion.div
					className="max-w-2xl"
					initial={reduce ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold tracking-tighter leading-[1.04] text-foreground mb-6">
						Your footage.<br />
						Your machine.<br />
						<span className="text-muted-foreground font-light">Your edit.</span>
					</h2>

					<p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-[40ch] font-light">
						No sign-up required. Open Dreamy and start editing in under ten seconds.
					</p>

					<div className="flex flex-row gap-3 items-center flex-wrap">
						<Link
							href="/editor"
							className="inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-md bg-foreground text-background text-sm font-medium transition-all hover:bg-foreground/85 active:scale-[0.98]"
						>
							Open editor free
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
								<path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
						<span className="text-xs text-muted-foreground/50 font-light">
							100% browser-based · Zero uploads
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
