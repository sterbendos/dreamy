"use client";

import { motion } from "motion/react";
import { Scissors, Captions, ShieldCheck } from "lucide-react";

const features = [
	{
		icon: Scissors,
		title: "Auto-Cut Silence",
		description:
			"Dreamy detects and removes dead air from your recordings automatically. Save hours of manual trimming with one click.",
		gradient: "from-violet-500 to-indigo-500",
	},
	{
		icon: Captions,
		title: "Auto-Subtitles",
		description:
			"Accurate, styled captions generated directly in your browser. No API keys, no uploads — your audio never leaves your device.",
		gradient: "from-fuchsia-500 to-violet-500",
	},
	{
		icon: ShieldCheck,
		title: "Private by Default",
		description:
			"Everything is processed locally using WebAssembly and WebCodecs. Your footage is yours — we never see it.",
		gradient: "from-blue-500 to-violet-500",
	},
];

export function Features() {
	return (
		<section id="features" className="relative px-4 py-24">
			<div className="mx-auto max-w-5xl">
				{/* Header */}
				<div className="mb-16 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-3xl font-bold tracking-tight md:text-5xl"
					>
						Everything you need.
						<br />
						<span
							className="bg-clip-text text-transparent"
							style={{ backgroundImage: "var(--gradient-dreamy)" }}
						>
							Nothing you don&apos;t.
						</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mx-auto mt-4 max-w-lg text-muted-foreground"
					>
						Dreamy packs the features creators actually use — without the bloat or the price tag.
					</motion.p>
				</div>

				{/* Cards */}
				<div className="grid gap-6 md:grid-cols-3">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
						>
							{/* Subtle glow on hover */}
							<div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								style={{ background: "radial-gradient(circle at 50% 0%, hsl(258 80% 62% / 0.08), transparent 70%)" }}
							/>

							<div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 text-white ${feature.gradient}`}>
								<feature.icon className="h-5 w-5" />
							</div>

							<h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
