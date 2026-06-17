"use client";

import { motion } from "motion/react";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
	{
		number: "01",
		icon: Upload,
		title: "Drop your video",
		description:
			"Drag and drop any video file straight into Dreamy. MP4, MOV, WebM — all supported. No conversion needed.",
	},
	{
		number: "02",
		icon: Wand2,
		title: "Let Dreamy work",
		description:
			"Hit Auto-Cut to strip silence, or Auto-Subtitles to generate captions. Our AI runs entirely in your browser — instant results, zero wait.",
	},
	{
		number: "03",
		icon: Download,
		title: "Export and share",
		description:
			"Export your finished video in your preferred format and resolution. Directly from the browser, no rendering farm required.",
	},
];

export function HowItWorks() {
	return (
		<section className="relative px-4 py-24">
			{/* Subtle divider gradient */}
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{ background: "var(--gradient-dreamy)", opacity: 0.25 }}
			/>

			<div className="mx-auto max-w-5xl">
				<div className="mb-16 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-3xl font-bold tracking-tight md:text-5xl"
					>
						How it works
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mx-auto mt-4 max-w-md text-muted-foreground"
					>
						From raw footage to finished video in minutes. No tutorials needed.
					</motion.p>
				</div>

				<div className="relative grid gap-8 md:grid-cols-3">
					{/* Connector line (desktop) */}
					<div className="absolute left-0 right-0 top-8 hidden h-px md:block"
						style={{ background: "linear-gradient(90deg, transparent, hsl(258 80% 62% / 0.3), hsl(295 70% 65% / 0.3), transparent)" }}
					/>

					{steps.map((step, i) => (
						<motion.div
							key={step.number}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.15 }}
							className="relative flex flex-col items-center text-center"
						>
							{/* Step circle */}
							<div
								className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25"
								style={{ background: "var(--gradient-dreamy)" }}
							>
								<step.icon className="h-7 w-7" />
								<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-primary ring-1 ring-border">
									{i + 1}
								</span>
							</div>

							<h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{step.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
