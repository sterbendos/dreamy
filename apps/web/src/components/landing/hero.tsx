"use client";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
	return (
		<section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			{/* Dramatic floating orbs for atmosphere */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50 -translate-y-1/2 translate-x-1/3 animate-pulse" />
			<div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-chart-2/20 blur-[100px] mix-blend-screen opacity-40 translate-y-1/2" />

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
						<span className="text-transparent bg-clip-text bg-gradient-dreamy italic pr-4">
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

				{/* Right Column: Abstract/Asymmetrical Visual */}
				<motion.div 
					className="lg:col-span-5 relative h-[500px] w-full hidden lg:block"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
				>
					<div className="absolute inset-0 rounded-3xl bg-gradient-dreamy opacity-20 blur-2xl" />
					<div className="absolute inset-0 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center">
						{/* Abstract Editor representation */}
						<div className="w-full h-full relative">
							<div className="absolute top-4 left-4 right-4 h-8 flex gap-2">
								<div className="w-3 h-3 rounded-full bg-white/20" />
								<div className="w-3 h-3 rounded-full bg-white/20" />
								<div className="w-3 h-3 rounded-full bg-white/20" />
							</div>
							<div className="absolute top-20 left-10 right-10 bottom-32 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
								<motion.div 
									className="w-16 h-16 rounded-full bg-primary/30 blur-xl"
									animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
									transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
								/>
							</div>
							<div className="absolute bottom-10 left-10 right-10 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center px-4 gap-2">
								<div className="h-full w-1 bg-primary/50 rounded-full" />
								<div className="h-full w-24 bg-chart-2/40 rounded-sm" />
								<div className="h-full w-12 bg-chart-3/40 rounded-sm" />
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
