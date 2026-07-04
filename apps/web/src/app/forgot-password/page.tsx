"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/auth/client";
import { ArrowLeft, Loader2, Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email");
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await authClient.forgetPassword({
				email,
				redirectTo: "/reset-password",
			});

			setIsLoading(false);
			if (error) {
				toast.error(error.message || "Failed to send reset email");
				return;
			}

			setIsSubmitted(true);
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred");
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden selection:bg-primary/30">
			{/* Ambient background gradients */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
				<div className="absolute left-[20%] top-[10%] h-[35rem] w-[35rem] rounded-full bg-primary/10 blur-[120px]" />
				<div className="absolute right-[20%] bottom-[10%] h-[35rem] w-[35rem] rounded-full bg-blue-500/10 blur-[120px]" />
			</div>

			<div className="relative z-10 w-full max-w-md px-6">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<Link href="/login">
						<Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-foreground">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to login
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
							Reset password
						</h1>
						<p className="text-sm text-muted-foreground">
							{isSubmitted ? "Check your email for a reset link" : "Enter your email to receive a reset link"}
						</p>
					</div>

					{isSubmitted ? (
						<div className="text-center space-y-4">
							<p className="text-sm text-muted-foreground">
								We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>. 
								Please check your inbox and spam folder.
							</p>
							<Button
								variant="outline"
								className="w-full h-11 mt-4"
								onClick={() => setIsSubmitted(false)}
							>
								Try a different email
							</Button>
						</div>
					) : (
						<form onSubmit={handleReset} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="email" className="text-sm font-medium px-1 text-foreground/80">Email</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="email"
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

							<Button
								type="submit"
								className="w-full h-11 mt-2 text-[15px] font-medium transition-all"
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Send Reset Link"
								)}
							</Button>
						</form>
					)}
				</motion.div>
			</div>
		</div>
	);
}
