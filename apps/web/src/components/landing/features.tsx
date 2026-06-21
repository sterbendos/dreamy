"use client";

import { motion } from "motion/react";
import { Scissors, Sparkles, Zap, Lock } from "lucide-react";

const features = [
	{
		title: "Silence Cutter",
		description: "Automatically detects and removes dead air, ums, and ahs from your footage.",
		icon: Scissors,
		color: "text-primary",
		bg: "bg-primary/10",
		border: "border-primary/20",
	},
	{
		title: "AI Subtitles",
		description: "Generate pixel-perfect captions instantly with Whisper-level accuracy.",
		icon: Sparkles,
		color: "text-chart-2",
		bg: "bg-chart-2/10",
		border: "border-chart-2/20",
	},
	{
		title: "WebAssembly Engine",
		description: "Desktop-grade performance running entirely in your browser window.",
		icon: Zap,
		color: "text-chart-3",
		bg: "bg-chart-3/10",
		border: "border-chart-3/20",
	},
	{
		title: "100% Private",
		description: "Your files never leave your device. All processing happens locally.",
		icon: Lock,
		color: "text-foreground",
		bg: "bg-muted",
		border: "border-border",
	},
];

export function Features() {
	return (
		<section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
			<div className="mb-32 max-w-3xl">
				<h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6">
					Designed to stay out of your way.
				</h2>
				<p className="text-xl text-muted-foreground font-light leading-relaxed">
					We stripped away the complexity of traditional NLEs and rebuilt video editing around what actually matters: speed, intelligence, and privacy.
				</p>
			</div>

			<div className="space-y-32">
				{features.map((feature, idx) => {
					const isEven = idx % 2 === 0;
					const Icon = feature.icon;
					return (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
						>
							<div className="flex-1 w-full">
								<div className={`p-12 rounded-3xl border ${feature.border} ${feature.bg} bg-opacity-30 backdrop-blur-sm`}>
									<div className={`h-16 w-16 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-8`}>
										<Icon className={`h-8 w-8 ${feature.color}`} />
									</div>
									<h3 className="text-3xl font-serif font-medium mb-4">{feature.title}</h3>
									<p className="text-lg text-muted-foreground leading-relaxed font-light">
										{feature.description}
									</p>
								</div>
							</div>
							
							{/* Empty space to allow the scroll path to snake through */}
							<div className="flex-1 w-full hidden md:block" />
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
