"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/auth/client";

// ── Types ──────────────────────────────────────────────────────────────────────

type Step = "plans" | "instructions" | "confirm" | "done";

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label: string }) {
	const [copied, setCopied] = useState(false);
	const copy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<button
			onClick={copy}
			className="flex items-center justify-between w-full bg-muted/60 border border-border/50 rounded-xl px-4 py-3 hover:bg-muted transition-colors group"
		>
			<div className="text-left">
				<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
				<p className="text-sm font-mono font-semibold text-foreground">{value}</p>
			</div>
			<span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-3">
				{copied ? "Copied!" : "Copy"}
			</span>
		</button>
	);
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PricingPage() {
	const { data: session } = useSession();
	const [step, setStep] = useState<Step>("plans");
	const [transferRef, setTransferRef] = useState("");
	const [senderPhone, setSenderPhone] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const router = useRouter();

	const instapay = {
		phone: process.env.NEXT_PUBLIC_INSTAPAY_PHONE ?? "01552859609",
		accountName: process.env.NEXT_PUBLIC_INSTAPAY_ACCOUNT_NAME ?? "Dreamy",
		amount: process.env.NEXT_PUBLIC_INSTAPAY_AMOUNT ?? "250",
		currency: "EGP",
	};

	const handleConfirm = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!transferRef.trim() || !senderPhone.trim()) return;

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const res = await fetch("/api/payment/confirm", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transferReference: transferRef.trim(),
					senderPhone: senderPhone.trim(),
				}),
			});

			if (res.status === 401) {
				router.push("/login?returnTo=/pricing");
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				setSubmitError(data.error ?? "Failed to submit. Please try again.");
				return;
			}

			setStep("done");
		} catch {
			setSubmitError("A network error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// ── Step: Plans ──────────────────────────────────────────────────────────
	if (step === "plans") {
		return (
			<div className="container mx-auto max-w-4xl py-24 px-4">
				<div className="text-center mb-14">
					<h1 className="text-5xl font-bold tracking-tight mb-4">Simple Pricing</h1>
					<p className="text-muted-foreground text-lg max-w-md mx-auto">
						Upgrade to Pro and unlock 200 AI commands per day with access to the best models.
					</p>
					<p className="text-sm text-muted-foreground mt-3">All prices in Egyptian Pounds (EGP)</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
					{/* Free */}
					<div className="border border-border/50 rounded-2xl p-8 flex flex-col gap-6 bg-card">
						<div>
							<h2 className="text-2xl font-bold">Free</h2>
							<p className="text-muted-foreground text-sm mt-1">For casual creators.</p>
						</div>
						<div className="text-4xl font-bold">
							0 EGP<span className="text-lg text-muted-foreground font-normal">/mo</span>
						</div>
						<ul className="flex flex-col gap-3 flex-1 text-sm text-muted-foreground">
							<li className="flex items-center gap-2">
								<span className="text-foreground">✓</span> 10 AI commands per day
							</li>
							<li className="flex items-center gap-2">
								<span className="text-foreground">✓</span> Llama 3.1, Gemma 3, Mistral 7B
							</li>
							<li className="flex items-center gap-2">
								<span className="text-foreground">✓</span> Core video editing features
							</li>
						</ul>
						<Button variant="outline" className="w-full" disabled>
							Current Plan
						</Button>
					</div>

					{/* Pro */}
					<div className="border-2 border-primary/60 rounded-2xl p-8 flex flex-col gap-6 bg-primary/5 relative overflow-hidden">
						<div className="absolute top-4 right-4 text-[10px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full tracking-wider">
							RECOMMENDED
						</div>
						<div>
							<h2 className="text-2xl font-bold">Pro</h2>
							<p className="text-muted-foreground text-sm mt-1">For serious editors.</p>
						</div>
						<div className="text-4xl font-bold">
							{instapay.amount} {instapay.currency}<span className="text-lg text-muted-foreground font-normal">/mo</span>
						</div>
						<ul className="flex flex-col gap-3 flex-1 text-sm">
							<li className="flex items-center gap-2 text-primary font-medium">
								<span>✓</span> 200 AI commands per day
							</li>
							<li className="flex items-center gap-2 text-primary font-medium">
								<span>✓</span> Claude 3.5 Sonnet & Haiku
							</li>
							<li className="flex items-center gap-2 text-muted-foreground">
								<span className="text-foreground">✓</span> All free models included
							</li>
							<li className="flex items-center gap-2 text-muted-foreground">
								<span className="text-foreground">✓</span> Priority support
							</li>
						</ul>
						<Button
							id="upgrade-btn"
							onClick={() => {
								if (!session) {
									router.push("/login?returnTo=/pricing");
									return;
								}
								setStep("instructions");
							}}
							className="w-full"
						>
							Upgrade via InstaPay
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// ── Step: InstaPay Instructions ──────────────────────────────────────────
	if (step === "instructions") {
		return (
			<div className="container mx-auto max-w-lg py-24 px-4">
				<button
					onClick={() => setStep("plans")}
					className="text-sm text-muted-foreground hover:text-foreground mb-8 flex items-center gap-1 transition-colors"
				>
					← Back
				</button>

				<div className="border border-border/50 rounded-2xl p-8 bg-card">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-lg">
							📱
						</div>
						<div>
							<h1 className="text-xl font-bold">Pay via InstaPay</h1>
							<p className="text-sm text-muted-foreground">Step 1 of 2 — Send the payment</p>
						</div>
					</div>

					<p className="text-sm text-muted-foreground mb-6 leading-relaxed">
						Open your bank app or InstaPay wallet, and send exactly{" "}
						<span className="text-foreground font-semibold">{instapay.amount} {instapay.currency}</span> to the following account.
						Keep your transfer reference number — you'll need it in the next step.
					</p>

					<div className="flex flex-col gap-3 mb-8">
						<CopyButton value={instapay.phone} label="InstaPay Phone Number" />
						<CopyButton value={instapay.accountName} label="Account Name" />
						<CopyButton value={instapay.amount} label="Amount (EGP)" />
					</div>

					<div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
						<p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
							<span className="font-semibold">Important:</span> Make sure the amount is exactly {instapay.amount} {instapay.currency} and
							save your transfer reference number (رقم العملية) before proceeding.
						</p>
					</div>

					<Button id="payment-sent-btn" onClick={() => setStep("confirm")} className="w-full">
						I've sent the payment →
					</Button>
				</div>
			</div>
		);
	}

	// ── Step: Confirm Transfer Reference ─────────────────────────────────────
	if (step === "confirm") {
		return (
			<div className="container mx-auto max-w-lg py-24 px-4">
				<button
					onClick={() => setStep("instructions")}
					className="text-sm text-muted-foreground hover:text-foreground mb-8 flex items-center gap-1 transition-colors"
				>
					← Back
				</button>

				<div className="border border-border/50 rounded-2xl p-8 bg-card">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-lg">
							✅
						</div>
						<div>
							<h1 className="text-xl font-bold">Confirm Your Payment</h1>
							<p className="text-sm text-muted-foreground">Step 2 of 2 — Submit reference</p>
						</div>
					</div>

					<p className="text-sm text-muted-foreground mb-6 leading-relaxed">
						Enter the transfer reference number from your bank app so we can verify your payment.
						Your subscription will be activated within a few hours.
					</p>

					<form onSubmit={handleConfirm} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="transfer-ref" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Transfer Reference (رقم العملية) *
							</label>
							<Input
								id="transfer-ref"
								value={transferRef}
								onChange={(e) => setTransferRef(e.target.value)}
								placeholder="e.g. TXN123456789"
								required
								className="font-mono"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label htmlFor="sender-phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Your InstaPay Phone Number *
							</label>
							<Input
								id="sender-phone"
								value={senderPhone}
								onChange={(e) => setSenderPhone(e.target.value)}
								placeholder="e.g. 01001234567"
								type="tel"
								required
							/>
							<p className="text-xs text-muted-foreground">
								The phone number you sent the payment from.
							</p>
						</div>

						{submitError && (
							<div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
								<p className="text-xs text-destructive">{submitError}</p>
							</div>
						)}

						<Button
							id="submit-payment-btn"
							type="submit"
							disabled={isSubmitting || !transferRef.trim() || !senderPhone.trim()}
							className="w-full mt-2"
						>
							{isSubmitting ? "Submitting…" : "Submit for Review"}
						</Button>
					</form>
				</div>
			</div>
		);
	}

	// ── Step: Done ────────────────────────────────────────────────────────────
	return (
		<div className="container mx-auto max-w-lg py-24 px-4 text-center">
			<div className="border border-border/50 rounded-2xl p-10 bg-card flex flex-col items-center gap-5">
				<div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-3xl">
					🎉
				</div>
				<div>
					<h1 className="text-2xl font-bold mb-2">Payment Submitted!</h1>
					<p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
						Your payment is under review. We'll activate your Pro subscription within a few hours.
						Check your account page for the updated status.
					</p>
				</div>
				<div className="flex gap-3 w-full">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => router.push("/account")}
					>
						My Account
					</Button>
					<Button className="flex-1" onClick={() => router.push("/editor")}>
						Continue Editing
					</Button>
				</div>
			</div>
		</div>
	);
}
