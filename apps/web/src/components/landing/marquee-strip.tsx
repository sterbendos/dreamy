"use client";

import { motion } from "motion/react";

const capabilities = [
	"Auto-Cut Silence",
	"AI Subtitles",
	"Multi-track Timeline",
	"WebCodecs Export",
	"Frame-Accurate Cuts",
	"Browser-native",
	"Privacy-First",
	"No Uploads",
	"GPU Accelerated",
	"Real-time Preview",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
	const items = [...capabilities, ...capabilities];
	return (
		<div className="flex overflow-hidden">
			<motion.div
				animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
				transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
				className="flex shrink-0 gap-6"
			>
				{items.map((item, i) => (
					<span
						key={`${item}-${i}`}
						className="inline-flex shrink-0 items-center gap-3 rounded-full border border-border/50 bg-card px-5 py-2 text-sm font-light text-muted-foreground/70"
					>
						<span
							className="h-1.5 w-1.5 rounded-full"
							style={{
								background: `hsl(${258 + (i % 3) * 37}, 80%, 65%)`,
							}}
						/>
						{item}
					</span>
				))}
			</motion.div>
		</div>
	);
}

export function MarqueeStrip() {
	return (
		<div className="relative w-full overflow-hidden py-12">
			{/* Fade edges */}
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
			<MarqueeRow />
		</div>
	);
}
