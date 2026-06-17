import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";

export const metadata: Metadata = {
	title: "Sponsors - Dreamy",
	description: "Support Dreamy and help us build the future of privacy-first video editing.",
	openGraph: {
		title: "Sponsors - Dreamy",
		description: "Support Dreamy and help us build the future of privacy-first video editing.",
		type: "website",
	},
};

export default function SponsorsPage() {
	return (
		<BasePage>
			<div className="flex flex-col gap-8 text-center">
				<h1 className="text-5xl font-bold tracking-tight md:text-6xl">
					Sponsors
				</h1>
				<p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-pretty">
					Support Dreamy and help us build the future of privacy-first video
					editing.
				</p>
			</div>
			<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
				<p className="text-muted-foreground text-lg">
					We currently have no sponsors.
				</p>
				<p className="text-muted-foreground text-sm max-w-md">
					Interested in sponsoring Dreamy? Reach out to us at{" "}
					<a
						href="mailto:hello@dreamy.app"
						className="text-foreground underline underline-offset-4 hover:opacity-70"
					>
						hello@dreamy.app
					</a>
				</p>
			</div>
		</BasePage>
	);
}
