"use client";

import { motion, useReducedMotion } from "motion/react";

const steps = [
	{
		number: "01",
		title: "Drop your files",
		desc: "Drag media directly into the browser. No upload dialog. No cloud intermediary. Your files stay on your machine.",
	},
	{
		number: "02",
		title: "Tell Dreamy what to cut",
		desc: 'Type a command or speak it. "Remove all silence", "Add bold yellow subtitles", "Trim the last take." The editor responds.',
	},
	{
		number: "03",
		title: "Export locally",
		desc: "Render to MP4 using FFmpeg.wasm at native speed. No queue. No waiting. File saves directly to your downloads.",
	},
];

export function HowItWorks() {
	const reduce = useReducedMotion();

	return (
		<section className="py-32 lg:py-40 border-t border-border/40">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24 items-start">

					{/* Left: sticky label block */}
					<div className="lg:sticky lg:top-28 self-start">
						<h2 className="text-4xl md:text-5xl font-sans font-semibold tracking-tighter leading-[1.05] text-foreground mb-5">
							Three steps.<br />
							<span className="text-muted-foreground font-light">That's it.</span>
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-[30ch] font-light">
							A workflow designed to disappear. You focus on the story; Dreamy handles the edit.
						</p>
					</div>

					{/* Right: numbered steps */}
					<div className="flex flex-col">
						{steps.map((step, idx) => (
							<motion.div
								key={step.number}
								className="relative flex gap-8 pb-12 last:pb-0 group"
								initial={reduce ? false : { opacity: 0, x: 16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{
									duration: 0.55,
									delay: idx * 0.1,
									ease: [0.16, 1, 0.3, 1],
								}}
							>
								{/* Vertical connector */}
								{idx < steps.length - 1 && (
									<div className="absolute left-[1.375rem] top-10 bottom-0 w-px bg-border/40" />
								)}

								{/* Number badge */}
								<div className="relative shrink-0">
									<div className="w-11 h-11 rounded-full border border-border bg-background flex items-center justify-center">
										<span className="text-xs font-semibold text-muted-foreground tabular-nums">
											{step.number}
										</span>
									</div>
									{/* Cobalt dot — shows on hover via group */}
									<div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/40 transition-colors duration-300" />
								</div>

								{/* Content */}
								<div className="flex flex-col gap-2 pt-2.5">
									<h3 className="text-lg font-semibold tracking-tight text-foreground">
										{step.title}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed font-light max-w-[44ch]">
										{step.desc}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
