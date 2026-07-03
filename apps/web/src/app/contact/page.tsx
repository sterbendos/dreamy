import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Contact - Dreamy",
	description: "Get in touch with the Dreamy team for support, billing, or feedback.",
	openGraph: {
		title: "Contact - Dreamy",
		description: "Get in touch with the Dreamy team for support, billing, or feedback.",
		type: "website",
	},
};

export default function ContactPage() {
	return (
		<BasePage
			maxWidth="2xl"
			title="Contact us"
			description="Have a question, feedback, or need help? We'd love to hear from you."
		>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-8">
					<h2 className="text-xl font-semibold">Email support</h2>
					<p className="text-muted-foreground leading-relaxed">
						For technical support, account issues, billing enquiries, or anything else — please email us directly. We typically respond within 24–48 hours.
					</p>
					<Button asChild className="w-fit mt-2">
						<Link href="mailto:ahmmmd1113@gmail.com">
							Email ahmmmd1113@gmail.com
						</Link>
					</Button>
				</div>

				<div className="flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-8">
					<h2 className="text-xl font-semibold">Discord community</h2>
					<p className="text-muted-foreground leading-relaxed">
						Join our Discord to get help from the community, report bugs, and stay up to date with the latest updates.
					</p>
					<Button asChild variant="outline" className="w-fit mt-2">
						<Link href="https://discord.com/invite/Mu3acKZvCp" target="_blank" rel="noopener noreferrer">
							Join Discord
						</Link>
					</Button>
				</div>


			</div>
		</BasePage>
	);
}
