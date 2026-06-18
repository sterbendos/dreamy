import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";

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
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<p className="text-muted-foreground text-lg">
					No posts yet — stay tuned.
				</p>
				<p className="text-muted-foreground text-sm max-w-md">
					We&apos;ll be sharing updates, tutorials, and news here soon.
				</p>
			</div>
		</BasePage>
	);
}
