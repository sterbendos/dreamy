"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
	return (
		<section className="px-4 py-24">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-px"
				style={{ background: "var(--gradient-dreamy)" }}
			>
				{/* Inner card */}
				<div className="relative rounded-[calc(1.5rem-1px)] bg-background px-8 py-16 text-center md:px-16">
					{/* Soft glow behind text */}
					<div
						className="pointer-events-none absolute inset-0 -z-10"
						style={{
							background:
								"radial-gradient(ellipse at 50% 0%, hsl(258 80% 62% / 0.12), transparent 65%)",
						}}
					/>

					<motion.h2
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-3xl font-bold tracking-tight md:text-5xl"
					>
						Ready to edit differently?
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mx-auto mt-4 max-w-md text-muted-foreground"
					>
						No sign-up. No credit card. Just open Dreamy and start creating — right now, in your browser.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-8 flex flex-wrap items-center justify-center gap-4"
					>
						<Link href="/projects">
							<Button
								size="lg"
								className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/30"
							>
								Start editing free
								<ArrowRight className="h-4 w-4" />
							</Button>
						</Link>
						<Link href="https://github.com/sterbendos/dreamy" target="_blank" rel="noopener noreferrer">
							<Button size="lg" variant="outline" className="h-12 px-8 text-base">
								View on GitHub
							</Button>
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
