"use client";

import { motion } from "motion/react";
import { Scissors, Captions, ShieldCheck } from "lucide-react";

const features = [
	{
		icon: Scissors,
		title: "Auto-Cut Silence",
		description:
			"Dreamy detects and removes dead air from your recordings automatically. Save hours of manual trimming with one click.",
		hue: "hsl(258, 85%, 65%)",
		accent: "bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20",
		glow: "group-hover:shadow-[0_0_32px_hsl(258,85%,65%,0.3)]",
	},
	{
		icon: Captions,
		title: "Auto-Subtitles",
		description:
			"Accurate, styled captions generated directly in your browser. No API keys, no uploads — your audio never leaves your device.",
		hue: "hsl(295, 70%, 65%)",
		accent: "bg-fuchsia-500/10 text-fuchsia-500 group-hover:bg-fuchsia-500/20",
		glow: "group-hover:shadow-[0_0_32px_hsl(295,70%,65%,0.3)]",
	},
	{
		icon: ShieldCheck,
		title: "Private by Default",
		description:
			"Everything is processed locally using WebAssembly and WebCodecs. Your footage is yours — we never see it.",
		hue: "hsl(220, 85%, 65%)",
		accent: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20",
		glow: "group-hover:shadow-[0_0_32px_hsl(220,85%,65%,0.3)]",
	},
];

export function Features() {
	return (
		<section id="features" className="relative px-4 py-32 md:py-48">
			{/* Colored top divider */}
			<div className="absolute inset-x-0 top-0 mx-auto max-w-xs h-px"
				style={{ background: "linear-gradient(90deg, transparent, hsl(258,85%,65%), hsl(295,70%,65%), transparent)" }}
			/>

			<div className="mx-auto max-w-5xl">
				{/* Header */}
				<div className="mb-24 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="font-serif text-4xl font-light tracking-tight md:text-6xl text-foreground"
					>
						Everything you need.
						<br />
						<span className="italic text-primary">
							Nothing you don&apos;t.
						</span>
					</motion.h2>
				</div>

				{/* Features List */}
				<div className="grid gap-16 md:grid-cols-3 md:gap-12">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
							className="flex flex-col items-center text-center group cursor-default"
						>
							<motion.div
								whileHover={{ y: -4, scale: 1.05 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${feature.accent} ${feature.glow}`}
							>
								<feature.icon className="h-6 w-6 stroke-[1.5]" />
							</motion.div>

							<h3 className="mb-4 font-serif text-2xl font-light text-foreground">{feature.title}</h3>
							<p className="text-base leading-relaxed text-muted-foreground/80 font-light">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
