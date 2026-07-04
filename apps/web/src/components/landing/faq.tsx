"use client";

import { motion, useReducedMotion } from "motion/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "Do I need to upload my videos to your servers?",
		answer: "No. Dreamy is a browser-native editor. Your video files stay entirely on your local machine. We use WebAssembly to process your video locally, ensuring maximum privacy and zero upload times."
	},
	{
		question: "How does the AI editing work?",
		answer: "Dreamy processes the audio track of your video locally to generate a transcript. Our AI agents then understand your text-based commands (like 'Remove all silent parts' or 'Add captions') and apply those edits directly to the timeline."
	},
	{
		question: "What is the difference between Free and Pro?",
		answer: "The Free plan gives you 10 AI commands per day and standard export quality. The Pro plan gives you 200 AI commands per day, unlocks 4K export, and gives you access to Claude 3.5 Haiku and DeepSeek V3 for faster, smarter editing commands."
	},
	{
		question: "What platforms does Dreamy work on?",
		answer: "Dreamy works on any modern desktop browser, but we highly recommend Google Chrome or Chromium-based browsers for the best WebAssembly performance and local file access capabilities."
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer: "Yes, you can cancel your Pro subscription at any time from your account settings. You will continue to have Pro access until the end of your current billing period."
	}
];

export function FAQ() {
	const reduce = useReducedMotion();

	return (
		<section className="py-32 lg:py-40">
			<div className="max-w-[800px] mx-auto px-6 sm:px-10">
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-sans font-semibold tracking-tighter text-foreground leading-[1.05] mb-4">
						Frequently asked questions
					</h2>
				</motion.div>

				<motion.div
					initial={reduce ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
				>
					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`} className="border-border/40 py-2">
								<AccordionTrigger className="text-left text-lg font-medium hover:no-underline hover:text-primary transition-colors">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
}
