"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
	return (
		<section className="px-4 py-32 md:py-48">
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
						<span className="italic text-primary">differently?</span>
					</h2>

					<p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground/80">
						No sign-up. No credit card. Just open Dreamy and start creating — right now, in your browser.
					</p>

					<Link href="/projects">
						<Button
							size="lg"
							className="h-14 gap-2 rounded-full px-10 text-lg font-medium shadow-sm hover:scale-[1.02] transition-transform"
						>
							Start editing free
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>

					<p className="text-sm text-muted-foreground/60 font-light">
						100% browser-based · No uploads required · Privacy-first
					</p>
				</motion.div>
			</div>
		</section>
	);
}
