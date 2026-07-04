"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/auth/client";
import { ArrowLeft, Loader2, Sparkles, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

function ResetPasswordForm() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password || !confirmPassword) {
			toast.error("Please fill in all fields");
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		if (!token) {
			toast.error("Missing or invalid reset token. Please request a new password reset link.");
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await authClient.resetPassword({
				newPassword: password,
				token: token,
			});

			setIsLoading(false);
			if (error) {
				toast.error(error.message || "Failed to reset password. The link may have expired.");
				return;
			}

			toast.success("Password reset successfully! You can now log in.");
			router.push("/login");
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred");
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleReset} className="space-y-4">
			<div className="space-y-1.5">
				<label htmlFor="password" className="text-sm font-medium px-1 text-foreground/80">New Password</label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						className="pl-9 pr-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
					>
						{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
					</button>
				</div>
			</div>

			<div className="space-y-1.5">
				<label htmlFor="confirmPassword" className="text-sm font-medium px-1 text-foreground/80">Confirm New Password</label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						id="confirmPassword"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						className="pl-9 pr-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						minLength={8}
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
					"Reset Password"
				)}
			</Button>
		</form>
	);
}

export default function ResetPasswordPage() {
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
							Set new password
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your new password below
						</p>
					</div>

					<Suspense fallback={<div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
						<ResetPasswordForm />
					</Suspense>
				</motion.div>
			</div>
		</div>
	);
}
