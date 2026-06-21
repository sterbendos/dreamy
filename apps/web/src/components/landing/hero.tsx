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

				{/* Right Column: Empty space for 3D Canvas elements to shine through */}
				<div className="lg:col-span-5 relative h-[500px] w-full hidden lg:block pointer-events-none" />
			</div>
		</section>
	);
}
