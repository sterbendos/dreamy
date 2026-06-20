"use client";

import { motion } from "motion/react";

const steps = [
	{
		number: "01",
		title: "Drop your video",
		description:
			"Drag and drop any video file straight into Dreamy. MP4, MOV, WebM — all supported. No conversion needed.",
		color: "hsl(258, 85%, 65%)",
	},
	{
		number: "02",
		title: "Let Dreamy work",
		description:
			"Hit Auto-Cut to strip silence, or Auto-Subtitles to generate captions. Our AI runs entirely in your browser — instant results, zero wait.",
		color: "hsl(295, 70%, 65%)",
	},
	{
		number: "03",
		title: "Export and share",
		description:
			"Export your finished video in your preferred format and resolution. Directly from the browser, no rendering farm required.",
		color: "hsl(220, 85%, 65%)",
	},
];

export function HowItWorks() {
	return (
		<section className="relative px-4 py-32 md:py-48">
			<div className="mx-auto max-w-5xl">
				<div className="mb-24 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="font-serif text-4xl font-light tracking-tight md:text-5xl text-foreground"
					>
						How it works
					</motion.h2>
				</div>

				<div className="relative grid gap-16 md:grid-cols-3 md:gap-12">
					{/* Animated connector line (desktop only) */}
					<div className="absolute left-[16%] right-[16%] top-4 hidden h-px md:block overflow-hidden">
						<motion.div
							initial={{ scaleX: 0 }}
							whileInView={{ scaleX: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
							className="h-full origin-left"
							style={{ background: "linear-gradient(90deg, hsl(258,85%,65%), hsl(295,70%,65%), hsl(220,85%,65%))", opacity: 0.25 }}
						/>
					</div>

					{steps.map((step, i) => (
						<motion.div
							key={step.number}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
							whileHover={{ y: -4 }}
							className="relative flex flex-col cursor-default"
						>
							<div
								className="mb-6 font-serif text-4xl font-light"
								style={{ color: step.color, opacity: 0.7 }}
							>
								{step.number}
							</div>

							<h3 className="mb-4 font-serif text-2xl font-light text-foreground">{step.title}</h3>
							<p className="text-base leading-relaxed text-muted-foreground/80 font-light">
								{step.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
