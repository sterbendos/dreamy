"use client";

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
	return (
		<div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">

			{/* Mesh gradient background */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				{/* Primary orb - top left */}
				<motion.div
					animate={{
						x: [0, 30, -20, 0],
						y: [0, -40, 20, 0],
						scale: [1, 1.1, 0.95, 1],
					}}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full opacity-[0.15]"
					style={{ background: "radial-gradient(circle, hsl(258, 85%, 65%), transparent 70%)" }}
				/>
				{/* Secondary orb - top right */}
				<motion.div
					animate={{
						x: [0, -40, 20, 0],
						y: [0, 30, -30, 0],
						scale: [1, 0.92, 1.08, 1],
					}}
					transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
					className="absolute -right-20 top-10 h-[500px] w-[500px] rounded-full opacity-[0.12]"
					style={{ background: "radial-gradient(circle, hsl(295, 70%, 65%), transparent 70%)" }}
				/>
				{/* Bottom accent orb */}
				<motion.div
					animate={{
						x: [0, 20, -30, 0],
						y: [0, -20, 10, 0],
						scale: [1, 1.05, 0.98, 1],
					}}
					transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
					className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full opacity-[0.08]"
					style={{ background: "radial-gradient(ellipse, hsl(220, 85%, 65%), transparent 70%)" }}
				/>
				{/* Noise grain overlay for texture */}
				<div
					className="absolute inset-0 opacity-[0.025]"
					style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }}
				/>
			</div>

			{/* Content */}
			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">

				{/* Eyebrow tag */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				>
					<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary/90 backdrop-blur-sm">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
						</span>
						Now in beta · 100% browser-based
					</span>
				</motion.div>

				{/* Headline */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
					className="flex flex-col items-center gap-6"
				>
					<h1 className="font-serif text-6xl font-light leading-[1.08] tracking-tight md:text-[88px] text-foreground">
						Edit videos that feel
						<br />
						<motion.span
							className="italic bg-clip-text text-transparent"
							style={{ backgroundImage: "linear-gradient(135deg, hsl(258, 85%, 65%), hsl(295, 75%, 65%), hsl(258, 85%, 65%))", backgroundSize: "200% 100%" }}
							animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
							transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
						>
							like dreams.
						</motion.span>
					</h1>
					<p className="mt-2 max-w-2xl text-lg font-light tracking-wide text-muted-foreground/75 md:text-xl leading-relaxed">
						A powerful AI video editor that runs entirely in your browser.
						Auto-cut silence, generate captions, and export — privately.
					</p>
				</motion.div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
					className="flex flex-col items-center gap-5"
				>
					<Link href="/projects">
						<motion.div
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: "spring", stiffness: 400, damping: 20 }}
						>
							<Button
								size="lg"
								className="relative h-14 gap-2.5 overflow-hidden rounded-full px-10 text-lg font-medium"
							>
								{/* Animated shimmer on button */}
								<motion.div
									className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
									animate={{ translateX: ["-100%", "200%"] }}
									transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
								/>
								Start editing free
								<ArrowRight className="h-5 w-5" />
							</Button>
						</motion.div>
					</Link>

					{/* Trust pills */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground/60"
					>
						{["No account needed", "Privacy-first", "Works on any device"].map((item, i) => (
							<motion.span
								key={item}
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 + i * 0.1 }}
								className="flex items-center gap-1.5"
							>
								<span className="h-1 w-1 rounded-full bg-primary/50" />
								{item}
							</motion.span>
						))}
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2, duration: 1 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
					className="flex flex-col items-center gap-2"
				>
					<div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
				</motion.div>
			</motion.div>
		</div>
	);
}
