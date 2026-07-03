import { Button } from "./ui/button";
import Link from "next/link";
import { Mail02Icon, Bug02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ContactSection({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 text-center">
				<h3 className="text-2xl font-semibold">{title}</h3>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<div className="flex flex-col justify-center gap-4 sm:flex-row">
				<Link
					href="mailto:ahmmmd1113@gmail.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button className="w-full" size="lg">
						<HugeiconsIcon icon={Mail02Icon} />
						Contact us
					</Button>
				</Link>
				<Link
					href="mailto:ahmmmd1113@gmail.com?subject=Bug Report"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="outline" className="w-full" size="lg">
						<HugeiconsIcon icon={Bug02Icon} />
						Report issues
					</Button>
				</Link>
			</div>
		</div>
	);
}
