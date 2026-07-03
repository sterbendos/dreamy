import type { Metadata } from "next";
import { BasePage } from "../base-page";

export const metadata: Metadata = {
	title: "Contributors - Dreamy",
	description: "Meet the people who contribute to Dreamy.",
	openGraph: {
		title: "Contributors - Dreamy",
		description: "Meet the people who contribute to Dreamy.",
		type: "website",
	},
};

export default function ContributorsPage() {
	return (
		<BasePage
			title="Contributors"
			description="Meet the people who contribute to Dreamy."
		>
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<p className="text-muted-foreground text-lg">
					We currently have no contributors listed.
				</p>

			</div>
		</BasePage>
	);
}
