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
					<motion.h1
						className="text-5xl sm:text-6xl md:text-8xl font-sans font-medium tracking-tighter text-foreground leading-[1.05] mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						Edit at the <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2 pr-4">
							speed of thought.
						</span>
					</motion.h1>

					<motion.p
						className="text-lg sm:text-xl text-muted-foreground max-w-xl font-light leading-relaxed mb-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
					>
						No timelines to battle. No clunky exports. Just talk to your footage,
						and watch the magic happen entirely in your browser.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
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

				{/* Right Column: Real Image Mockup */}
				<motion.div 
					className="lg:col-span-5 relative w-full hidden lg:block"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
				>
					<div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black/50">
						{/* Use regular img for demo, next/image normally */}
						<img 
							src="/editor-mockup.png" 
							alt="Cutflow Video Editor Interface" 
							className="w-full h-auto object-cover"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
