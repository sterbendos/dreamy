import Link from "next/link";
import { capitalizeFirstLetter } from "@/utils/string";

type Category = "resources" | "company";

interface FooterLink {
	label: string;
	href: string;
}

type CategoryLinks = Record<Category, FooterLink[]>;

const links: CategoryLinks = {
	resources: [
		{ label: "Roadmap", href: "/roadmap" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "Changelog", href: "/changelog" },
		{ label: "Blog", href: "/blog" },
		{ label: "Privacy", href: "/privacy" },
		{ label: "Terms of use", href: "/terms" },
	],
	company: [
		{ label: "Contact", href: "/contact" },
		{ label: "Contributors", href: "/contributors" },
		{ label: "Sponsors", href: "/sponsors" },
		{ label: "Brand", href: "/brand" },
	],
};

export function Footer() {
	return (
		<footer className="bg-background border-t border-border/40">
			<div className="mx-auto max-w-5xl px-8 py-16">
				<div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
					{/* Brand Section */}
					<div className="max-w-sm">
						<Link href="/" className="inline-block mb-5">
						<span className="font-sans text-base font-semibold tracking-tight text-foreground">Dreamy</span>
					</Link>
						<p className="text-muted-foreground/70 text-sm font-light leading-relaxed">
							The privacy-first video editor that feels simple to use.
						</p>
					</div>

					<div className="flex items-start justify-start gap-16 py-1">
						{(Object.keys(links) as Category[]).map((category) => (
							<div key={category} className="flex flex-col gap-3">
								<h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
									{capitalizeFirstLetter({ string: category })}
								</h3>
								<ul className="space-y-3 text-sm">
									{links[category].map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-muted-foreground/70 hover:text-foreground transition-colors font-light"
												target={link.href.startsWith("http") ? "_blank" : undefined}
												rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-border/30 pt-8">
					<p className="text-muted-foreground/50 text-xs font-light">
						© {new Date().getFullYear()} Dreamy. All Rights Reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
