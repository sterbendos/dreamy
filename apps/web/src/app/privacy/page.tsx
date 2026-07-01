import type { Metadata } from "next";
import { BasePage } from "@/app/base-page";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";


export const metadata: Metadata = {
	title: "Privacy Policy - Dreamy",
	description:
		"Learn how Dreamy handles your data and privacy. Our commitment to protecting your information while you edit videos.",
	openGraph: {
		title: "Privacy Policy - Dreamy",
		description:
			"Learn how Dreamy handles your data and privacy. Our commitment to protecting your information while you edit videos.",
		type: "website",
	},
};

export default function PrivacyPage() {
	return (
		<BasePage
			title="Privacy policy"
			description="Learn how we handle your data and privacy. Contact us if you have any questions."
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
							Your videos never leave your device.
						</h3>
						<ol className="list-decimal space-y-2 pl-6">
							<li>
								All editing and AI processing (Whisper, captions, etc.) runs locally
								in your browser via WASM — no data leaves your device
							</li>
							<li>
								Videos and projects are stored locally in your browser (IndexedDB)
								— never uploaded to our servers
							</li>
							<li>
								We store only your account info (email, name) in our PostgreSQL
								database via Drizzle ORM
							</li>
							<li>
								InstaPay is used for Pro subscriptions — we store only your
								phone number and transfer reference for payment verification
							</li>
							<li>
								We use anonymized analytics (Databuddy) — no personal video
								content is tracked
							</li>
							<li>
								You can delete your account or contact us to exercise your
								privacy rights at any time
							</li>
							<li>
								We don&apos;t sell or share your personal data with third parties
							</li>
						</ol>
						<p className="mt-4">
							Questions? Email us at{" "}
							<a
								href="mailto:ahmmmd1113@gmail.com"
								className="text-primary hover:underline"
							>
								ahmmmd1113@gmail.com
							</a>
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">How We Handle Your Content</h2>
				<p>
					<strong>
						All editing and processing happens locally on your device.
					</strong>{" "}
					We never upload, store, or have access to your video or audio files.
					Your content remains completely private and under your control.
					AI-powered features like auto captions also run in your browser using
					on-device models - no content ever leaves your device.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Accounts & Authentication</h2>
				<p>
					Dreamy uses email/password accounts via better-auth. When you sign up,
					we store your email address and name in our PostgreSQL database using
					Drizzle ORM.
				</p>
				<p>
					Your account is required for Pro subscription features. We do not
					collect OAuth identity data or social login information.
				</p>
				<p>
					Your videos and projects are never stored on our servers. All project
					data, including names, thumbnails, and creation dates, is stored
					locally in your browser using IndexedDB.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Analytics</h2>
				<p>
					We use{" "}
					<a
						href="https://www.databuddy.cc"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						Databuddy
					</a>{" "}
					for basic, anonymized visitor counts. We do not track clicks,
					interactions, or how you use the editor.
				</p>
				<p>
					No personal information is collected, no individual users are tracked,
					and no data that could identify you is stored.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Local Storage & Cookies</h2>
				<p>We use browser local storage and IndexedDB to:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Save your projects locally on your device</li>
					<li>Remember your editor preferences and settings</li>
					<li>Store app state needed for the editor to work between sessions</li>
				</ul>
				<p>
					All data stays on your device and can be cleared at any time through
					your browser settings.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Third-Party Services</h2>
				<p>Dreamy integrates with these services:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Vercel:</strong> For hosting and content delivery
					</li>
					<li>
						<strong>InstaPay:</strong> For processing Pro subscription payments.
						We store your phone number and transfer reference for payment
						verification only.
					</li>
					<li>
						<strong>Databuddy:</strong> For anonymized analytics
					</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Your Rights</h2>
				<p>You have complete control over your data:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Delete your account at any time — contact us via email</li>
					<li>Request an export of your account data (email, name)</li>
					<li>Clear local storage in your browser to remove all saved projects</li>
					<li>Contact us with any privacy concerns or data requests</li>
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Transparency</h2>
				<p>
					Dreamy is built with transparency in mind. All video and audio
					processing runs locally in your browser — we have no technical
					ability to access your content, even if we wanted to.
				</p>
				<p>
					For any questions about how we handle your data, contact us at{" "}
					<a
						href="mailto:ahmmmd1113@gmail.com"
						className="text-primary hover:underline"
					>
						ahmmmd1113@gmail.com
					</a>
					.
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-2xl font-semibold">Contact Us</h2>
				<p>Questions about this privacy policy or how we handle your data?</p>
				<p>
					Email us at{" "}
					<a
						href="mailto:ahmmmd1113@gmail.com"
						className="text-primary hover:underline"
					>
						ahmmmd1113@gmail.com
					</a>
					, or join our{" "}
					<a
						href="https://discord.com/invite/Mu3acKZvCp"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						Discord
					</a>
					.
				</p>
			</section>

			<Separator />

			<p className="text-muted-foreground text-sm">
				Last updated: July 1, 2026
			</p>
		</BasePage>
	);
}
