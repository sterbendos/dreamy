"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function ScrollPath() {
	const [height, setHeight] = useState(0);
	const { scrollYProgress } = useScroll();
	const scaleY = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001
	});

	// Update height on mount and resize
	useEffect(() => {
		const updateHeight = () => {
			setHeight(document.documentElement.scrollHeight);
		};
		updateHeight();
		window.addEventListener("resize", updateHeight);
		// Slight delay to allow dynamic content to load
		setTimeout(updateHeight, 1000);
		return () => window.removeEventListener("resize", updateHeight);
	}, []);

	if (height === 0) return null;

	return (
		<div className="pointer-events-none absolute left-0 top-0 w-full overflow-hidden" style={{ height: `${height}px`, zIndex: 0 }}>
			<svg
				className="absolute left-1/2 top-0 h-full w-[800px] -translate-x-1/2"
				viewBox="0 0 800 1000"
				preserveAspectRatio="none"
				fill="none"
			>
				{/* Background faint path */}
				<path
					d="M 400 0 C 600 100, 600 200, 400 300 C 200 400, 200 500, 400 600 C 600 700, 600 800, 400 900 C 200 950, 400 980, 400 1000"
					stroke="url(#gradient)"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					className="opacity-10 dark:opacity-20"
				/>
				{/* Animated drawing path */}
				<motion.path
					d="M 400 0 C 600 100, 600 200, 400 300 C 200 400, 200 500, 400 600 C 600 700, 600 800, 400 900 C 200 950, 400 980, 400 1000"
					stroke="url(#gradient)"
					strokeWidth="4"
					vectorEffect="non-scaling-stroke"
					style={{ pathLength: scaleY }}
					className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
					strokeLinecap="round"
				/>
				
				<defs>
					<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="hsl(258, 80%, 62%)" stopOpacity="0" />
						<stop offset="20%" stopColor="hsl(258, 80%, 62%)" />
						<stop offset="50%" stopColor="hsl(295, 70%, 65%)" />
						<stop offset="80%" stopColor="hsl(220, 80%, 60%)" />
						<stop offset="100%" stopColor="hsl(258, 80%, 62%)" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}
