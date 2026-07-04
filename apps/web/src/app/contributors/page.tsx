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
			<div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
				<p className="text-muted-foreground text-lg">
					We currently have no contributors listed.
				</p>
				<div className="bg-muted/40 border border-border/50 rounded-2xl p-8 max-w-lg mt-8">
					<h3 className="text-xl font-semibold mb-2">Want to contribute?</h3>
					<p className="text-muted-foreground text-sm mb-6">
						Dreamy is built by a community of passionate developers and creators. If you'd like to help build the future of browser-native video editing, we'd love your help.
					</p>
					<div className="flex gap-4 justify-center">
						<a href="https://github.com/aahmmmd/cutflow" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
							View GitHub Repo
						</a>
						<a href="https://discord.gg/dreamy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
							Join our Discord
						</a>
					</div>
				</div>
			</div>
		</BasePage>
	);
}
