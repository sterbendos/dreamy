"use client";

import { motion } from "motion/react";
import { Scissors, Captions, Music, Play } from "lucide-react";

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

const bulletPoints = [
	"Multi-track video & audio timeline",
	"Real-time WebCodecs preview",
	"Frame-accurate trimming and cuts",
	"Export to MP4, WebM, and more",
];

export function Showcase() {
	return (
		<section className="relative px-4 py-32 md:py-48">
			<div className="mx-auto max-w-6xl">
				<div className="grid items-center gap-20 md:grid-cols-2">
					{/* Left: copy */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="flex flex-col gap-8"
					>
						<h2 className="font-serif text-4xl font-light leading-snug tracking-tight md:text-5xl text-foreground">
							A timeline that stays
							<br />
							<span className="italic text-primary">out of your way.</span>
						</h2>

						<p className="text-lg leading-relaxed text-muted-foreground/80 font-light">
							Dreamy&apos;s editor is built around speed. Drop in your footage, let the AI clean it up, and fine-tune on an intuitive multi-track timeline. No menus to hunt through. Just your story.
						</p>

						<ul className="space-y-4">
							{bulletPoints.map((item) => (
								<li key={item} className="flex items-center gap-3 text-muted-foreground font-light">
									<span className="h-px w-6 shrink-0 bg-primary/50" />
									{item}
								</li>
							))}
						</ul>
					</motion.div>

					{/* Right: editor mockup */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
						className="relative rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 overflow-hidden"
					>
						{/* Toolbar */}
						<div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
							<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
							<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
							<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
							<span className="ml-3 text-xs font-medium text-muted-foreground/60">Dreamy Editor</span>
						</div>

						{/* Tool strip */}
						<div className="flex items-center gap-1 border-b border-border/60 px-4 py-2">
							{tools.map((tool) => (
								<button
									key={tool.label}
									type="button"
									className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
										tool.active
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground"
									}`}
								>
									<tool.icon className="h-3.5 w-3.5" />
									{tool.label}
								</button>
							))}
						</div>

						{/* Preview area */}
						<div className="flex items-center justify-center bg-black/90 aspect-video">
							<div className="text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
									<Play className="h-5 w-5 fill-current ml-0.5" />
								</div>
								<p className="text-[10px] text-white/30 tracking-widest uppercase">Preview</p>
							</div>
						</div>

						{/* Timeline */}
						<div className="p-4 space-y-2">
							<p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">Timeline</p>
							{tracks.map((track) => (
								<motion.div
									key={track.label}
									initial={{ opacity: 0, scaleX: 0 }}
									whileInView={{ opacity: 1, scaleX: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.3 + track.delay }}
									style={{ transformOrigin: "left" }}
									className="flex items-center gap-3"
								>
									<span className="w-28 shrink-0 truncate text-[10px] text-muted-foreground/60">
										{track.label}
									</span>
									<div className="relative h-4 flex-1 rounded-sm bg-muted/30 overflow-hidden">
										<div className={`absolute inset-y-0 left-0 rounded-sm ${track.width} ${track.color} opacity-60`} />
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
