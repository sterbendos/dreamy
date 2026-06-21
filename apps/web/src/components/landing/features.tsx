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
		<section id="features" className="relative py-32 z-10">
			<div className="mb-24 max-w-2xl">
				<h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-6">
					Designed to stay out of your way.
				</h2>
				<p className="text-xl text-muted-foreground font-light leading-relaxed">
					We stripped away the complexity of traditional NLEs and rebuilt video editing around what actually matters: speed, intelligence, and privacy.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{features.map((feature, idx) => {
					const Icon = feature.icon;
					return (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ 
								type: "spring",
								stiffness: 100,
								damping: 20,
								delay: idx * 0.1 
							}}
							className="group"
						>
							<div className={`h-full p-10 rounded-2xl border ${feature.border} bg-card/60 backdrop-blur-md transition-all duration-300 hover:bg-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5`}>
								<div className={`h-14 w-14 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-6`}>
									<Icon className={`h-6 w-6 ${feature.color}`} />
								</div>
								<h3 className="text-2xl font-serif font-medium mb-3">{feature.title}</h3>
								<p className="text-base text-muted-foreground leading-relaxed font-light">
									{feature.description}
								</p>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
