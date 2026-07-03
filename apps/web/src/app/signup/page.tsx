"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/auth/client";
import { ArrowLeft, Loader2, Sparkles, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !password) {
			toast.error("Please fill in all fields");
			return;
		}
		if (!acceptTerms) {
			toast.error("Please accept the Terms of Service and Privacy Policy");
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await signUp.email({
				email,
				password,
				name,
			});

			setIsLoading(false);
			if (error) {
				toast.error(error.message || "Failed to create account. Please try again.");
				return;
			}

			toast.success("Account created successfully!");
			router.push("/projects");
			router.refresh();
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred");
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden selection:bg-primary/30">
			{/* Ambient background gradients */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
				<div className="absolute right-[20%] top-[10%] h-[35rem] w-[35rem] rounded-full bg-primary/10 blur-[120px]" />
				<div className="absolute left-[20%] bottom-[10%] h-[35rem] w-[35rem] rounded-full bg-blue-500/10 blur-[120px]" />
			</div>

			<div className="relative z-10 w-full max-w-md px-6 my-12">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<Link href="/">
						<Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-foreground">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to home
						</Button>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
					className="bg-muted/40 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/5 rounded-3xl p-8"
				>
					<div className="flex flex-col items-center text-center mb-8">
						<div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
							<Sparkles className="w-6 h-6 text-primary" />
						</div>
						<h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1.5">
							Create an account
						</h1>
						<p className="text-sm text-muted-foreground">
							Start building with Dreamy today
						</p>
					</div>

					<form onSubmit={handleSignup} className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium px-1 text-foreground/80">Full Name</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									type="text"
									placeholder="John Doe"
									className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									autoComplete="name"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium px-1 text-foreground/80">Email</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									type="email"
									placeholder="you@example.com"
									className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium px-1 text-foreground/80">Password</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									type="password"
									placeholder="••••••••"
									className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="new-password"
									minLength={8}
								/>
							</div>
							<p className="text-xs text-muted-foreground px-1">Minimum 8 characters. Mix of letters and numbers recommended.</p>
						</div>

						<label className="flex items-start gap-2.5 cursor-pointer group">
							<div className="mt-0.5">
								<input
									type="checkbox"
									checked={acceptTerms}
									onChange={(e) => setAcceptTerms(e.target.checked)}
									className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary focus:ring-primary/20 cursor-pointer"
								/>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
								I agree to the{" "}
								<Link href="/terms" className="text-foreground underline underline-offset-2 hover:text-primary">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary">
									Privacy Policy
								</Link>
							</p>
						</label>

						<Button
							type="submit"
							className="w-full h-11 mt-2 text-[15px] font-medium transition-all"
							disabled={isLoading || !acceptTerms}
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								"Create Account"
							)}
						</Button>
					</form>

					<div className="mt-8 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
						>
							Sign in
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
