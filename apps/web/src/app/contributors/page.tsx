import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
	title: "Contributors - Dreamy",
	description: "Meet the people building Dreamy.",
	openGraph: {
		title: "Contributors - Dreamy",
		description: "Meet the people building Dreamy.",
		type: "website",
	},
};

export default function ContributorsPage() {
	return (
		<BasePage
			maxWidth="2xl"
			title="Contributors"
			description="Dreamy is built by a small founding team."
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-8">
					<h2 className="text-xl font-semibold">Ahmed Elkady</h2>
					<p className="text-sm text-muted-foreground">Founder & Engineer</p>
					<p className="text-muted-foreground leading-relaxed">
						Ahmed is the founder and sole engineer behind Dreamy. He designs and builds the entire product, from the editor and AI integrations to the web platform and payments.
					</p>
					<Button asChild variant="outline" className="w-fit mt-2">
						<Link href="mailto:ahmmmd1113@gmail.com">
							<Mail className="w-4 h-4 mr-2" />
							Contact Ahmed
						</Link>
					</Button>
				</div>

				<div className="flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-8">
					<h2 className="text-xl font-semibold">Want to be part of what&apos;s next?</h2>
					<p className="text-muted-foreground leading-relaxed">
						Dreamy is at an early stage and growing. If you&apos;re excited about browser-native video editing, AI-assisted creative tools, or building in public — we&apos;d love to hear from you.
					</p>
					<Button asChild className="w-fit mt-2">
						<Link href="mailto:ahmmmd1113@gmail.com">
							<Mail className="w-4 h-4 mr-2" />
							Reach out at ahmmmd1113@gmail.com
						</Link>
					</Button>
				</div>
			</div>
		</BasePage>
	);
}