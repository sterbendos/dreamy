"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function JourneyLine({ children }: { children: React.ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);
	
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	});

	const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return (
		<div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* The Track */}
			<div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-border/30 hidden md:block" />
			
			{/* The Glowing Trace */}
			<motion.div 
				className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-chart-2 to-primary hidden md:block origin-top"
				style={{ scaleY: pathLength }}
			>
				{/* The Playhead / Lead Dot */}
				<motion.div className="absolute -bottom-1 -left-1.5 h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
			</motion.div>

			{/* The Content */}
			<div className="md:pl-16 relative">
				{children}
			</div>
		</div>
	);
}
