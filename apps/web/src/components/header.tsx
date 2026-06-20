"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/ui";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const closeMenu = () => setIsMenuOpen(false);

	const links = [
		{
			label: "Roadmap",
			href: "/roadmap",
		},
		{
			label: "Contributors",
			href: "/contributors",
		},
		{
			label: "Sponsors",
			href: "/sponsors",
		},
		{
			label: "Blog",
			href: "/blog",
		},
	];

	return (
		<header className="bg-background/90 backdrop-blur-md border-b border-border/30 sticky top-0 z-10">
			<div className="relative flex w-full items-center justify-between px-8 py-4">
				<div className="relative z-10 flex items-center gap-8">
					<Link href="/" className="flex items-center">
						<span className="font-serif text-lg font-light italic text-foreground">Dreamy</span>
					</Link>
					<nav className="hidden items-center gap-6 md:flex">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="relative z-10">
					<div className="flex items-center gap-3 md:hidden">
						<Button
							variant="text"
							size="icon"
							className="flex items-center justify-center p-0"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<HugeiconsIcon icon={Menu02Icon} size={30} />
						</Button>
					</div>
					<div className="hidden items-center gap-3 md:flex">
						<Link href="/projects">
							<Button className="text-sm">
								Projects
								<ArrowRight className="size-4" />
							</Button>
						</Link>
						<ThemeToggle />
					</div>
				</div>
				<div
					className={cn(
						"bg-background/20 pointer-events-none fixed inset-0 opacity-0 backdrop-blur-3xl",
						"transition-opacity duration-150",
						isMenuOpen && "pointer-events-auto opacity-100",
					)}
				>
					<div className="relative h-full">
						<button
							type="button"
							aria-label="Close menu"
							className="absolute inset-0"
							onClick={closeMenu}
							onKeyDown={(event) => {
								if (
									event.key === "Enter" ||
									event.key === " " ||
									event.key === "Escape"
								) {
									event.preventDefault();
									closeMenu();
								}
							}}
						/>
						<nav className="flex flex-col gap-3 px-6 pt-[5rem]">
							{links.map((link, index) => (
								<motion.div
									key={link.href}
									initial={{ scale: 0.98, opacity: 0 }}
									animate={{
										scale: isMenuOpen ? 1 : 0.98,
										opacity: isMenuOpen ? 1 : 0,
									}}
									transition={{
										duration: 0.4,
										delay: isMenuOpen ? index * 0.1 : 0,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
								>
									<Link
										href={link.href}
										className="font-serif text-2xl font-light italic text-foreground"
										onClick={() => setIsMenuOpen(false)}
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</nav>
						<ThemeToggle
							className="absolute right-8 bottom-8 size-10"
							iconClassName="!size-[1.2rem]"
							onToggle={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
