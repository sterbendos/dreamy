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
			<div className="flex flex-col items-center justify-center gap-6 py-20 text-center max-w-lg mx-auto">
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold tracking-tight text-foreground">Subscribe to our newsletter</h2>
					<p className="text-muted-foreground text-sm">
						Get the latest updates, tutorials, and feature releases straight to your inbox. No spam.
					</p>
				</div>
				<form className="flex w-full max-w-sm items-center space-x-2" onSubmit={(e) => {
					e.preventDefault();
					// Add toast or logic here if desired
					const form = e.target as HTMLFormElement;
					form.reset();
				}}>
					<input
						type="email"
						placeholder="Email address"
						required
						className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
					<button
						type="submit"
						className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0"
					>
						Subscribe
					</button>
				</form>
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
