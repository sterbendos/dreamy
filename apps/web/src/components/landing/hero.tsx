"use client";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
	return (
		<section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
				{/* Left Column: Massive Editorial Typography */}
				<div className="lg:col-span-7 flex flex-col items-start text-left">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<Badge
							variant="secondary"
							className="mb-8 font-medium tracking-wide bg-primary/10 text-primary border-primary/20"
						>
							<Sparkles className="mr-2 h-3 w-3" />
							Next-Gen Video Editing
						</Badge>
					</motion.div>

					<motion.h1
						className="text-5xl sm:text-6xl md:text-8xl font-serif font-medium tracking-tight text-foreground leading-[1.05] mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
					>
						Edit at the <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2 italic pr-4">
							speed of thought.
						</span>
					</motion.h1>

					<motion.p
						className="text-lg sm:text-xl text-muted-foreground max-w-xl font-light leading-relaxed mb-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
					>
						No timelines to battle. No clunky exports. Just talk to your footage,
						and watch the magic happen entirely in your browser.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
					>
						<Button
							size="lg"
							className="h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-95"
							asChild
						>
							<Link href="/editor">
								Start Editing Free
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="h-14 px-8 text-base border-border/50 bg-background/50 backdrop-blur-md hover:bg-muted/50 transition-all"
						>
							<Play className="mr-2 h-4 w-4" /> Watch Reel
						</Button>
					</motion.div>
				</div>

				{/* Right Column: 2D Glass Editor Mockup */}
				<motion.div 
					className="lg:col-span-5 relative h-[450px] w-full hidden lg:block"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
				>
					<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-chart-2/20 blur-2xl opacity-50" />
					<div className="absolute inset-0 rounded-3xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
						{/* Editor Header */}
						<div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
							<div className="w-3 h-3 rounded-full bg-white/20" />
							<div className="w-3 h-3 rounded-full bg-white/20" />
							<div className="w-3 h-3 rounded-full bg-white/20" />
						</div>
						{/* Editor Preview */}
						<div className="flex-1 p-4 flex items-center justify-center">
							<div className="w-full h-full rounded-xl bg-black/50 border border-white/5 relative overflow-hidden flex items-center justify-center group cursor-pointer">
								<div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30 group-hover:scale-110 transition-transform">
									<Play className="w-6 h-6 text-primary fill-primary translate-x-0.5" />
								</div>
							</div>
						</div>
						{/* Editor Timeline */}
						<div className="h-32 border-t border-white/10 bg-black/40 p-4 space-y-2 relative">
							<div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-primary shadow-[0_0_10px_rgba(138,43,226,0.8)] z-10" />
							<div className="w-3/4 h-6 rounded bg-primary/40 border border-primary/50 relative overflow-hidden">
								<div className="absolute inset-0 bg-white/10 w-1/3" />
							</div>
							<div className="w-1/2 h-6 rounded bg-chart-2/40 border border-chart-2/50 ml-12" />
							<div className="w-2/3 h-6 rounded bg-chart-3/40 border border-chart-3/50" />
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
