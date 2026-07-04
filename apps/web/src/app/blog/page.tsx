import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import { NewsletterForm } from "./newsletter-form";

export const metadata: Metadata = {
	title: "Blog - Dreamy",
	description: "Read the latest news and updates from the Dreamy team.",
	openGraph: {
		title: "Blog - Dreamy",
		description: "Read the latest news and updates from the Dreamy team.",
		type: "website",
	},
};

export default function BlogPage() {
	return (
		<BasePage
			title="Blog"
			description="Read the latest news and updates from the Dreamy team."
		>
			<div className="flex flex-col items-center justify-center gap-6 py-20 text-center max-w-lg mx-auto">
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold tracking-tight text-foreground">Subscribe to our newsletter</h2>
					<p className="text-muted-foreground text-sm">
						Get the latest updates, tutorials, and feature releases straight to your inbox. No spam.
					</p>
				</div>
				<NewsletterForm />
				<div className="mt-12 space-y-2">
					<p className="text-muted-foreground text-lg">
						No posts yet — stay tuned.
					</p>
					<p className="text-muted-foreground text-sm">
						We&apos;ll be publishing articles here soon.
					</p>
				</div>
			</div>
		</BasePage>
	);
}
