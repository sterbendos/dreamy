"use client";

import { motion, useReducedMotion } from "motion/react";

const capabilities = [
	"Silence Cutter",
	"AI Subtitles",
	"Frame-accurate Timeline",
	"WebAssembly Export",
	"Local Processing",
	"GPU Accelerated",
	"Privacy-First",
	"No Uploads Required",
	"Real-time Preview",
	"Multi-track Audio",
];

export function MarqueeStrip() {
	const reduce = useReducedMotion();
	const items = [...capabilities, ...capabilities];

	return (
		<div className="relative w-full overflow-hidden py-10 border-y border-border/30">
			{/* Fade edges */}
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

			<div className="flex overflow-hidden">
				<motion.div
					animate={reduce ? {} : { x: ["0%", "-50%"] }}
					transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
					className="flex shrink-0 gap-4"
				>
					{items.map((item, i) => (
						<span
							key={`${item}-${i}`}
							className="inline-flex shrink-0 items-center gap-3 rounded-full border border-border/60 bg-card/60 px-5 py-2 text-xs font-medium text-muted-foreground/80 tracking-wide"
						>
							<span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
							{item}
						</span>
					))}
				</motion.div>
			</div>
		</div>
	);
}
