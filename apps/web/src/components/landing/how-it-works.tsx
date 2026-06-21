"use client";

import { motion } from "motion/react";

const steps = [
	{
		number: "01",
		title: "Drag & Drop",
		desc: "Drop your media files directly into the browser. No uploads, no servers. It stays on your device.",
	},
	{
		number: "02",
		title: "Talk to Dreamy",
		desc: "\"Cut all the silence\", \"Add subtitles in bold yellow\", \"Remove that last take\". Just type or speak your edits.",
	},
	{
		number: "03",
		title: "Instant Export",
		desc: "Render locally using blazing fast WebAssembly. Get your final MP4 in seconds, not minutes.",
	},
];

export function HowItWorks() {
	return (
		<section className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 border-t border-border/40 mt-32">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
				
				<div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
					<h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-6">
						Editing, <br className="hidden lg:block"/>
						<span className="italic text-muted-foreground">simplified.</span>
					</h2>
					<p className="text-lg text-muted-foreground font-light">
						Three steps to perfect video. 
						Your workflow just got a massive upgrade.
					</p>
				</div>

				<div className="lg:col-span-8 space-y-12">
					{steps.map((step, idx) => (
						<motion.div
							key={step.number}
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ 
								type: "spring",
								stiffness: 100,
								damping: 20,
								delay: idx * 0.1 
							}}
							className="relative pl-12 md:pl-20 py-8 border-b border-border/20 last:border-0 group"
						>
							<div className="absolute left-0 top-6 text-5xl font-serif font-light text-primary/10 transition-colors duration-300 group-hover:text-primary/30">
								{step.number}
							</div>
							<div className="relative z-10">
								<h3 className="text-2xl font-medium mb-3">{step.title}</h3>
								<p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
									{step.desc}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
