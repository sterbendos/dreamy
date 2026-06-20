"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/utils/ui";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const closeMenu = () => setIsMenuOpen(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 24);
	});

	const links = [
		{ label: "Roadmap", href: "/roadmap" },
		{ label: "Contributors", href: "/contributors" },
		{ label: "Sponsors", href: "/sponsors" },
		{ label: "Blog", href: "/blog" },
	];

	return (
		<header
			className={cn(
				"sticky top-0 z-10 transition-all duration-300",
				scrolled
					? "bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-sm"
					: "bg-transparent border-b border-transparent",
			)}
		>
			{/* Gradient progress line on scroll */}
			<motion.div
				className="absolute bottom-0 left-0 h-px origin-left"
				style={{
					background: "linear-gradient(90deg, hsl(258,85%,65%), hsl(295,70%,65%))",
					scaleX: scrolled ? 1 : 0,
					transition: "transform 0.4s ease",
				}}
			/>

			<div className="relative flex w-full items-center justify-between px-8 py-4">
				<div className="relative z-10 flex items-center gap-8">
					<Link href="/" className="group flex items-center relative">
						<span className="font-serif text-lg font-light italic text-foreground transition-colors group-hover:text-primary">
							Dreamy
						</span>
						{/* Animated underline */}
						<motion.span
							className="absolute -bottom-0.5 left-0 h-px origin-left"
							initial={{ scaleX: 0 }}
							whileHover={{ scaleX: 1 }}
							transition={{ duration: 0.3 }}
							style={{ background: "linear-gradient(90deg, hsl(258,85%,65%), hsl(295,70%,65%))", width: "100%" }}
						/>
					</Link>
					<nav className="hidden items-center gap-6 md:flex">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="group relative text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
							>
								{link.label}
								<span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
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
							<motion.div
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: "spring", stiffness: 400, damping: 20 }}
							>
								<Button className="text-sm rounded-full px-5">
									Open Editor
									<ArrowRight className="size-4" />
								</Button>
							</motion.div>
						</Link>
						<ThemeToggle />
					</div>
				</div>

				{/* Mobile overlay */}
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
								if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
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


