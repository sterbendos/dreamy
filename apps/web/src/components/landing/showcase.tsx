"use client";

import { motion } from "motion/react";
import { Play, Scissors, Captions, Music } from "lucide-react";

const tracks = [
	{ label: "Main interview.mp4", width: "w-[75%]", color: "bg-primary/80", delay: 0 },
	{ label: "B-roll clip.mp4", width: "w-[45%]", color: "bg-violet-400/70", delay: 0.1 },
	{ label: "Background music.mp3", width: "w-[90%]", color: "bg-fuchsia-400/60", delay: 0.2 },
];

const tools = [
	{ icon: Scissors, label: "Auto-Cut", active: true },
	{ icon: Captions, label: "Subtitles", active: false },
	{ icon: Music, label: "Audio", active: false },
];

export function Showcase() {
	return (
		<section className="relative overflow-hidden px-4 py-24">
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{ background: "var(--gradient-dreamy)", opacity: 0.2 }}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="grid items-center gap-16 md:grid-cols-2">
					{/* Left: copy */}
					<motion.div
						initial={{ opacity: 0, x: -24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="flex flex-col gap-6"
					>
						<div
							className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
						>
							<Play className="h-3 w-3 fill-current" />
							Web-native editor
						</div>

						<h2 className="text-3xl font-bold tracking-tight md:text-4xl">
							A timeline that stays
							<br />
							<span
								className="bg-clip-text text-transparent"
								style={{ backgroundImage: "var(--gradient-dreamy)" }}
							>
								out of your way.
							</span>
						</h2>

						<p className="leading-relaxed text-muted-foreground">
							Dreamy&apos;s editor is built around speed. Drop in your footage, let the AI clean it up, and fine-tune on an intuitive multi-track timeline. No menus to hunt through. No subscriptions. Just your story.
						</p>

						<ul className="space-y-3 text-sm">
							{[
								"Multi-track video & audio timeline",
								"Real-time WebCodecs preview",
								"Frame-accurate trimming and cuts",
								"Export to MP4, WebM, and more",
							].map((item) => (
								<li key={item} className="flex items-center gap-2 text-muted-foreground">
									<span
										className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
										style={{ background: "var(--gradient-dreamy)" }}
									>
										✓
									</span>
									{item}
								</li>
							))}
						</ul>
					</motion.div>

					{/* Right: editor mockup */}
					<motion.div
						initial={{ opacity: 0, x: 24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden"
					>
						{/* Toolbar */}
						<div className="flex items-center gap-2 border-b border-border bg-accent/30 px-4 py-3">
							<span className="h-3 w-3 rounded-full bg-destructive/60" />
							<span className="h-3 w-3 rounded-full bg-caution/60" />
							<span className="h-3 w-3 rounded-full bg-constructive/60" />
							<span className="ml-2 text-xs font-medium text-muted-foreground">Dreamy Editor</span>
						</div>

						{/* Tool strip */}
						<div className="flex items-center gap-1 border-b border-border px-4 py-2">
							{tools.map((tool) => (
								<button
									key={tool.label}
									type="button"
									className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
										tool.active
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									<tool.icon className="h-3.5 w-3.5" />
									{tool.label}
								</button>
							))}
						</div>

						{/* Preview area */}
						<div className="flex items-center justify-center bg-black/80 aspect-video">
							<div className="text-center">
								<div
									className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-white"
									style={{ background: "var(--gradient-dreamy)", opacity: 0.85 }}
								>
									<Play className="h-6 w-6 fill-current ml-1" />
								</div>
								<p className="text-xs text-white/40">Preview</p>
							</div>
						</div>

						{/* Timeline */}
						<div className="p-4 space-y-2">
							<p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Timeline</p>
							{tracks.map((track, i) => (
								<motion.div
									key={track.label}
									initial={{ opacity: 0, scaleX: 0 }}
									whileInView={{ opacity: 1, scaleX: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.3 + track.delay }}
									style={{ transformOrigin: "left" }}
									className="flex items-center gap-3"
								>
									<span className="w-28 shrink-0 truncate text-[10px] text-muted-foreground">
										{track.label}
									</span>
									<div className="relative h-5 flex-1 rounded-sm bg-muted/40 overflow-hidden">
										<div className={`absolute inset-y-0 left-0 rounded-sm ${track.width} ${track.color}`} />
									</div>
								</motion.div>
							))}
							{/* Playhead */}
							<div className="relative mt-1 h-3">
								<motion.div
									initial={{ left: "0%" }}
									whileInView={{ left: "38%" }}
									viewport={{ once: true }}
									transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
									className="absolute top-0 flex flex-col items-center"
									style={{ position: "absolute" }}
								>
									<div className="h-3 w-px bg-primary" />
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
