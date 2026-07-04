"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/auth/client";
import { ArrowLeft, Loader2, Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const router = useRouter();

	const getPasswordStrength = (pass: string) => {
		if (!pass) return { label: "", color: "bg-muted" };
		if (pass.length < 8) return { label: "Weak", color: "bg-destructive" };
		const hasLower = /[a-z]/.test(pass);
		const hasUpper = /[A-Z]/.test(pass);
		const hasNumber = /[0-9]/.test(pass);
		const hasSpecial = /[^A-Za-z0-9]/.test(pass);
		
		const hasMixedCase = hasLower && hasUpper;
		if (hasMixedCase && hasNumber && hasSpecial) return { label: "Strong", color: "bg-emerald-500" };
		if (hasMixedCase || hasNumber) return { label: "Fair", color: "bg-yellow-500" };
		return { label: "Weak", color: "bg-destructive" };
	};
	const strength = getPasswordStrength(password);

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
			router.push("/dashboard");
			router.refresh();
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred");
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setIsGoogleLoading(true);
		try {
			await signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});
		} catch (error: any) {
			toast.error(error?.message || "Failed to log in with Google");
			setIsGoogleLoading(false);
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
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									className="pl-9 pr-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 h-11"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="new-password"
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
							
							{password.length > 0 ? (
								<div className="px-1 mt-2">
									<div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
										<div className={`h-full flex-1 ${strength.label === "Weak" || strength.label === "Fair" || strength.label === "Strong" ? strength.color : "bg-muted"}`} />
										<div className={`h-full flex-1 ${strength.label === "Fair" || strength.label === "Strong" ? strength.color : "bg-muted"}`} />
										<div className={`h-full flex-1 ${strength.label === "Strong" ? strength.color : "bg-muted"}`} />
									</div>
									<p className="text-xs mt-1.5 font-medium flex justify-between">
										<span className="text-muted-foreground">Password strength:</span>
										<span className={
											strength.label === "Strong" ? "text-emerald-500" :
											strength.label === "Fair" ? "text-yellow-500" : "text-destructive"
										}>{strength.label}</span>
									</p>
								</div>
							) : (
								<p className="text-xs text-muted-foreground px-1">Minimum 8 characters. Mix of letters and numbers recommended.</p>
							)}
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
								<Link href="/terms-of-use" className="text-foreground underline underline-offset-2 hover:text-primary">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary">
									Privacy Policy
								</Link>
							</p>
						</label>

						<div>
							<Button
								type="submit"
								className="w-full h-11 mt-2 text-[15px] font-medium transition-all"
								disabled={isLoading || isGoogleLoading || !acceptTerms}
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Create Account"
								)}
							</Button>
							{!acceptTerms && (
								<p className="text-xs text-center text-muted-foreground mt-2">Please agree to the Terms of Service to continue.</p>
							)}
						</div>
					</form>

					<div className="mt-6 flex items-center justify-center space-x-4">
						<div className="h-px bg-border/50 flex-1" />
						<span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Or</span>
						<div className="h-px bg-border/50 flex-1" />
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full h-11 mt-6 text-[15px] font-medium transition-all bg-background hover:bg-muted"
						disabled={isLoading || isGoogleLoading}
						onClick={handleGoogleLogin}
					>
						{isGoogleLoading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<>
								<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
									<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
									<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
									<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
								</svg>
								Continue with Google
							</>
						)}
					</Button>

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
