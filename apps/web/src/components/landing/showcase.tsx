"use client";

import { motion, useReducedMotion } from "motion/react";

// This section is a full-width editorial statement break.
// Layout family: centered manifesto — distinct from bento and numbered-list above.
export function Showcase() {
	const reduce = useReducedMotion();

	return (
		<section className="relative py-32 lg:py-48 border-t border-border/40 overflow-hidden">
			{/* Subtle grid texture */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.025]"
				style={{
					backgroundImage:
						"linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			<div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
				<motion.div
					className="max-w-3xl"
					initial={reduce ? false : { opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
				>
					<p className="text-xs font-medium tracking-widest uppercase text-muted-foreground/50 mb-8">
						The editor
					</p>

					<h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold tracking-tighter text-foreground leading-[1.04] mb-8">
						The browser is<br />
						<span className="text-muted-foreground font-light">now a studio.</span>
					</h2>

					<p className="text-base text-muted-foreground leading-relaxed max-w-[52ch] mb-12 font-light">
						Dreamy runs FFmpeg, Whisper-level transcription, and a full multi-track timeline entirely inside your browser window — no installation, no backend, no compromise on performance.
					</p>

					{/* Three inline stats — different visual treatment from card bento above */}
					<div className="flex flex-col sm:flex-row gap-8 sm:gap-16 pt-8 border-t border-border/40">
						{[
							{ value: "< 100ms", label: "AI response latency" },
							{ value: "WASM", label: "Native-speed codec" },
							{ value: "Local", label: "All rendering" },
						].map((stat) => (
							<div key={stat.label} className="flex flex-col gap-1">
								<span className="text-2xl font-semibold tracking-tight text-foreground">
									{stat.value}
								</span>
								<span className="text-xs text-muted-foreground/60 font-light uppercase tracking-wider">
									{stat.label}
								</span>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
