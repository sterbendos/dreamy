"use client";

import { motion, useReducedMotion } from "motion/react";

const features = [
	{
		id: "local",
		title: "Zero video uploads",
		body: "Your massive video files stay exactly where they are—on your hard drive. Because everything runs locally, you can start editing the second you drop a file.",
		stat: "Instant",
		statLabel: "import time",
		accent: false,
		className: "md:col-span-1 md:row-span-2",
	},
	{
		id: "ai",
		title: "Direct your edit",
		body: "Don't hunt for the razor tool. Just type 'Remove the dead air' or 'Add cinematic captions' and let our AI agents execute the cuts perfectly.",
		stat: null,
		statLabel: null,
		accent: true,
		className: "md:col-span-1",
	},
	{
		id: "render",
		title: "Render without the wait",
		body: "By utilizing your browser's local power, exports happen directly on your machine. No cloud servers, no queues, no forced compression.",
		stat: null,
		statLabel: null,
		accent: false,
		className: "md:col-span-1",
	},
];

export function Features() {
	const reduce = useReducedMotion();

	return (
		<section id="features" className="py-32 lg:py-40">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

				{/* Section lead — no eyebrow */}
				<div className="mb-16 max-w-xl">
					<h2 className="text-4xl md:text-5xl font-sans font-semibold tracking-tighter text-foreground leading-[1.05] mb-4">
						Built for momentum.
					</h2>
					<p className="text-base text-muted-foreground leading-relaxed">
						We stripped away the clutter of traditional timeline editors so you can focus entirely on the story.
					</p>
				</div>

				{/* Asymmetric bento: 2-col, first cell spans 2 rows */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{features.map((f, i) => (
						<motion.div
							key={f.id}
							className={f.className}
							initial={reduce ? false : { opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{
								duration: 0.6,
								delay: i * 0.08,
								ease: [0.16, 1, 0.3, 1],
							}}
						>
							<div
								className={`h-full rounded-xl border p-8 flex flex-col gap-4 ${
									f.accent
										? "border-primary/30 bg-primary/5"
										: "border-border bg-card"
								}`}
							>
								{/* Stat or accent bar */}
								{f.id === "privacy" && (
									<div className="mb-4">
										<p className="text-[4.5rem] font-semibold tracking-tighter text-foreground leading-none tabular-nums">
											{f.stat}
											<span className="text-2xl text-muted-foreground/50 ml-1 font-light">{f.statLabel}</span>
										</p>
									</div>
								)}
								{f.accent && (
									<div className="w-8 h-0.5 bg-primary mb-2" />
								)}

								<h3 className="text-xl font-semibold tracking-tight text-foreground">
									{f.title}
								</h3>
								<p className="text-sm text-muted-foreground leading-relaxed font-light">
									{f.body}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
