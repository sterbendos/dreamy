"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface PendingPayment {
	id: string;
	userId: string;
	transferReference: string;
	senderPhone: string;
	amount: number;
	status: string;
	createdAt: string;
}

export default function AdminPaymentsPage() {
	const [secret, setSecret] = useState("");
	const [authed, setAuthed] = useState(false);
	const [payments, setPayments] = useState<PendingPayment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchPayments = useCallback(async (adminSecret: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/admin/payments", {
				headers: { "x-admin-secret": adminSecret },
			});
			if (res.status === 403) {
				setError("Invalid admin secret.");
				setAuthed(false);
				return;
			}
			const data = await res.json();
			setPayments(data.payments ?? []);
			setAuthed(true);
		} catch {
			setError("Failed to load payments.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleAction = async (paymentId: string, action: "approve" | "reject") => {
		setActionLoading(paymentId + action);
		try {
			const endpoint = action === "approve" ? "/api/payment/approve" : "/api/payment/reject";
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-admin-secret": secret,
				},
				body: JSON.stringify({ pendingPaymentId: paymentId }),
			});
			const data = await res.json();
			if (res.ok) {
				// Refresh list
				fetchPayments(secret);
			} else {
				alert(`Error: ${data.error}`);
			}
		} finally {
			setActionLoading(null);
		}
	};

	if (!authed) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background px-4">
				<div className="w-full max-w-sm bg-card border border-border/50 rounded-2xl p-8 flex flex-col gap-5">
					<div>
						<h1 className="text-2xl font-bold">Admin Login</h1>
						<p className="text-sm text-muted-foreground mt-1">Enter your admin secret to view pending payments.</p>
					</div>
					<input
						id="admin-secret-input"
						type="password"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
						placeholder="Admin secret"
						className="w-full bg-muted border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-primary transition-colors"
						onKeyDown={(e) => {
							if (e.key === "Enter") fetchPayments(secret);
						}}
					/>
					{error && <p className="text-xs text-destructive">{error}</p>}
					<Button
						onClick={() => fetchPayments(secret)}
						disabled={!secret.trim() || isLoading}
					>
						{isLoading ? "Verifying…" : "Access Dashboard"}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-5xl py-16 px-4">
			<div className="flex items-center justify-between mb-10">
				<div>
					<h1 className="text-3xl font-bold">Pending Payments</h1>
					<p className="text-muted-foreground mt-1">Review and approve or reject InstaPay submissions.</p>
				</div>
				<Button variant="outline" onClick={() => fetchPayments(secret)} disabled={isLoading}>
					{isLoading ? "Refreshing…" : "Refresh"}
				</Button>
			</div>

			{payments.length === 0 ? (
				<div className="border border-border/50 rounded-2xl p-12 text-center text-muted-foreground bg-card">
					<p className="text-lg font-medium">No pending payments</p>
					<p className="text-sm mt-1">All payment submissions have been reviewed.</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{payments.map((payment) => (
						<div
							key={payment.id}
							className="border border-border/50 rounded-2xl p-6 bg-card flex flex-col sm:flex-row sm:items-center gap-4"
						>
							<div className="flex-1 flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<span className="text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
										PENDING
									</span>
									<span className="text-xs text-muted-foreground font-mono">{payment.id.slice(0, 8)}…</span>
								</div>
								<div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mt-1">
									<span className="text-muted-foreground">User ID</span>
									<span className="font-mono text-xs">{payment.userId}</span>
									<span className="text-muted-foreground">Transfer Ref</span>
									<span className="font-mono font-semibold">{payment.transferReference}</span>
									<span className="text-muted-foreground">Phone</span>
									<span>{payment.senderPhone}</span>
									<span className="text-muted-foreground">Amount</span>
									<span className="font-semibold">{payment.amount} EGP</span>
									<span className="text-muted-foreground">Submitted</span>
									<span>{new Date(payment.createdAt).toLocaleString("en-EG")}</span>
								</div>
							</div>

							<div className="flex gap-2 sm:flex-col">
								<Button
									id={`approve-${payment.id}`}
									size="sm"
									className="flex-1 sm:flex-none sm:w-28 bg-emerald-600 hover:bg-emerald-700 text-white"
									onClick={() => handleAction(payment.id, "approve")}
									disabled={actionLoading !== null}
								>
									{actionLoading === payment.id + "approve" ? "…" : "✓ Approve"}
								</Button>
								<Button
									id={`reject-${payment.id}`}
									variant="destructive"
									size="sm"
									className="flex-1 sm:flex-none sm:w-28"
									onClick={() => handleAction(payment.id, "reject")}
									disabled={actionLoading !== null}
								>
									{actionLoading === payment.id + "reject" ? "…" : "✕ Reject"}
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
