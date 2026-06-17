import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { SOCIAL_LINKS } from "@/site/social";

export const metadata: Metadata = {
	title: "Terms of Service - Dreamy",
	description:
		"Dreamy's Terms of Service. Fair and transparent terms for the Dreamy video editor.",
	openGraph: {
		title: "Terms of Service - Dreamy",
		description:
			"Dreamy's Terms of Service. Fair and transparent terms for the Dreamy video editor.",
		type: "website",
	},
};

export default function TermsPage() {
	return (
		<BasePage
			title="Terms of service"
			description="Fair and transparent terms for the Dreamy video editor. Contact us if you have any questions."
		>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem
					value="quick-summary"
					className="rounded-2xl border px-5"
				>
					<AccordionTrigger className="no-underline!">
						Quick summary
					</AccordionTrigger>
					<AccordionContent>
						<h3 className="mb-3 text-lg font-medium">
							You own your content, we own nothing.
						</h3>
						<ol className="list-decimal space-y-2 pl-6">
							<li>
								Everything runs locally in your browser - nothing is ever
								uploaded to our servers
							</li>
							<li>
								We never claim ownership of your content
							</li>
							<li>
								Free for personal and commercial use with no watermarks or
								restrictions
							</li>
							<li>
								You&apos;re responsible for how you use it - don&apos;t break
								the law
							</li>
							<li>
								Service provided &quot;as is&quot; - we can&apos;t guarantee
								perfect uptime
							</li>
							<li>
								Your files stay on your device — we never see or store them
							</li>
							<li>
								No account required - your exported videos are always yours
							</li>
						</ol>
						<p className="mt-4">
							Questions? Email us at{" "}
							<a
								href="mailto:hello@dreamy.app"
								className="text-primary hover:underline"
							>
								hello@dreamy.app
							</a>
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Your Content, Your Rights</h2>
				<p>
					<strong>You own everything you create.</strong> All editing and
					processing happens locally on your device. We never see, store, or
					have access to your files. We make no claims to ownership, licensing,
					or rights over your videos, projects, or any content you create using
					Dreamy.
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Your content never leaves your device
					</li>
					<li>You retain all intellectual property rights to your content</li>
					<li>You can export and use your content however you choose</li>
					<li>No watermarks, no licensing restrictions from Dreamy</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">How You Can Use Dreamy</h2>
				<p>Dreamy is free for personal and commercial use. You can:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Create videos for personal, educational, or commercial purposes
					</li>
					<li>Use Dreamy for client work and paid projects</li>
					<li>Share and distribute videos created with Dreamy</li>
				</ul>
				<p>
					You&apos;re responsible for how you use Dreamy and the content you
					create. Don&apos;t use it for anything illegal in your jurisdiction.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">AI Features</h2>
				<p>
					AI features like auto captions run entirely in your browser using
					on-device models. No content is uploaded to any server. These features
					are optional - you can use Dreamy without them.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Service</h2>
				<p>
					Dreamy does not currently require an account. The service is provided
					&quot;as is&quot; without warranties. While we strive for
					reliability, we can&apos;t guarantee uninterrupted service.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Intellectual Property</h2>
				<p>
					Dreamy and the Dreamy logo are proprietary. The software is provided
					for use under the terms of this agreement and may not be copied,
					modified, sublicensed, or redistributed without written permission.
				</p>
				<p>
					For questions about licensing, contact{" "}
					<a
						href="mailto:legal@dreamy.app"
						className="text-primary hover:underline"
					>
						legal@dreamy.app
					</a>
					.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Limitations and Liability</h2>
				<p>
					Dreamy is provided free of charge. To the extent permitted by law:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>We&apos;re not liable for any loss of data or content</li>
					<li>
						Projects are stored in your browser and may be lost if you clear
						browser data
					</li>
					<li>We&apos;re not responsible for how you use the service</li>
					<li>Our liability is limited to the maximum extent allowed by law</li>
				</ul>
				<p>
					Since your content stays on your device, we have no way to recover
					lost projects. Consider exporting important videos when finished
					editing.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Service Changes</h2>
				<p>We may update Dreamy and these terms:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>We&apos;ll notify you of significant changes to these terms</li>
					<li>Continued use means you accept any updates</li>
					<li>You can always self-host an older version if you prefer</li>
					<li>Major changes will be discussed with the community on GitHub</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Stopping Use</h2>
				<p>You can stop using Dreamy at any time:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Clear your browser data to remove local projects</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Contact Us</h2>
				<p>Questions about these terms or need to report an issue?</p>
				<p>
					Contact us at{" "}
					<a
						href="mailto:hello@dreamy.app"
						className="text-primary hover:underline"
					>
						hello@dreamy.app
					</a>
					, or reach out on{" "}
					<a
						href={SOCIAL_LINKS.x}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						X (Twitter)
					</a>
					.
				</p>
				<p>
					These terms are governed by applicable law in your jurisdiction. We
					prefer to resolve disputes through friendly discussion.
				</p>
			</section>
			<Separator />
			<p className="text-muted-foreground text-sm">
				Last updated: March 15, 2026
			</p>
		</BasePage>
	);
}
