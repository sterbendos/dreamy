"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
	return (
		<section className="relative px-4 py-32 md:py-48 overflow-hidden">
			{/* Background gradient orbs */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<motion.div
					animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.18, 0.12] }}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
					style={{ background: "radial-gradient(circle, hsl(258, 85%, 65%), transparent 70%)" }}
				/>
				<motion.div
					animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
					className="absolute left-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
					style={{ background: "radial-gradient(circle, hsl(295, 70%, 65%), transparent 70%)" }}
				/>
				<motion.div
					animate={{ scale: [1, 1.12, 1], opacity: [0.06, 0.12, 0.06] }}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
					className="absolute right-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
					style={{ background: "radial-gradient(circle, hsl(220, 85%, 65%), transparent 70%)" }}
				/>
			</div>

			<div className="mx-auto max-w-4xl text-center">
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="flex flex-col items-center gap-10"
				>
					<h2 className="font-serif text-5xl font-light leading-[1.1] tracking-tight md:text-7xl text-foreground">
						Ready to edit
						<br />
						<motion.span
							className="italic bg-clip-text text-transparent"
							style={{
								backgroundImage: "linear-gradient(135deg, hsl(258, 85%, 65%), hsl(295, 75%, 65%), hsl(258, 85%, 65%))",
								backgroundSize: "200% 100%",
							}}
							animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
							transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
						>
							differently?
						</motion.span>
					</h2>

					<p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground/80">
						No sign-up. No credit card. Just open Dreamy and start creating — right now, in your browser.
					</p>

					<Link href="/projects">
						<motion.div
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.96 }}
							transition={{ type: "spring", stiffness: 400, damping: 20 }}
						>
							<Button
								size="lg"
								className="relative h-14 gap-2.5 overflow-hidden rounded-full px-10 text-lg font-medium"
							>
								<motion.div
									className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
									animate={{ translateX: ["-100%", "200%"] }}
									transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
								/>
								Start editing free
								<ArrowRight className="h-5 w-5" />
							</Button>
						</motion.div>
					</Link>

					<p className="text-sm text-muted-foreground/50 font-light">
						100% browser-based · No uploads required · Privacy-first
					</p>
				</motion.div>
			</div>
		</section>
	);
}
