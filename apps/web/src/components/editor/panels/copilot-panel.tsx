"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, X, Send, Loader2, Check } from "lucide-react";
import { ModelSelector } from "./model-selector";

import { useEditor } from "@/editor/use-editor";
import { LIMITS, getAvailableModels } from "@/billing/tiers";
import type { Tier } from "@/billing/tiers";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusData {
	tier: Tier;
	usageToday: number;
	dailyLimit: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToolBadge({ toolName, done }: { toolName: string; done: boolean }) {
	const label = toolName.replace(/_/g, " ");
	return (
		<div
			className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
				done
					? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
					: "bg-primary/10 text-primary border border-primary/20 animate-pulse"
			}`}
		>
			{done ? (
				<Check className="w-3 h-3" />
			) : (
				<Loader2 className="w-3 h-3 animate-spin" />
			)}
			{done ? `Done: ${label}` : `Running: ${label}…`}
		</div>
	);
}

function ThinkingIndicator() {
	return (
		<div className="flex items-start gap-2.5">
			<div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
				<Sparkles className="w-3 h-3 text-primary" />
			</div>
			<div className="bg-muted/60 border border-border/40 rounded-2xl rounded-tl-sm px-3 py-2.5">
				<div className="flex gap-1 items-center h-4">
					<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
					<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
					<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
				</div>
			</div>
		</div>
	);
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CopilotPanel() {
	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState<StatusData | null>(null);
	const [isFetchingStatus, setIsFetchingStatus] = useState(false);
	const [selectedModel, setSelectedModel] = useState<string | null>(null);
	const [rateLimitError, setRateLimitError] = useState<string | null>(null);
	const [retryCountdown, setRetryCountdown] = useState(0);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const copilot = useEditor((e) => e.copilot);
	const router = useRouter();

	// ── Fetch subscription status when panel opens ──────────────────────────
	const fetchStatus = useCallback(async () => {
		setIsFetchingStatus(true);
		try {
			const res = await fetch("/api/payment/status");
			if (!res.ok) return; // unauthenticated — stay as null, use free defaults
			const data: StatusData = await res.json();
			setStatus(data);
			// Reset model to first allowed if the current one isn't available
			setSelectedModel((prev) => {
				const models = getAvailableModels(data.tier);
				if (!prev || !models.find((m) => m.id === prev)) {
					return models[0]?.id ?? null;
				}
				return prev;
			});
		} catch {
			// silently ignore — user will just get free tier defaults
		} finally {
			setIsFetchingStatus(false);
		}
	}, []);

	useEffect(() => {
		if (isOpen) fetchStatus();
	}, [isOpen, fetchStatus]);

	// ── Countdown timer for rate limit ──────────────────────────────────────
	useEffect(() => {
		if (retryCountdown <= 0) {
			if (countdownRef.current) clearInterval(countdownRef.current);
			setRateLimitError(null);
			return;
		}
		countdownRef.current = setInterval(() => {
			setRetryCountdown((prev) => {
				if (prev <= 1) {
					if (countdownRef.current) clearInterval(countdownRef.current);
					setRateLimitError(null);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => {
			if (countdownRef.current) clearInterval(countdownRef.current);
		};
	}, [retryCountdown]);

	// ── Derived values ──────────────────────────────────────────────────────
	const tier: Tier = status?.tier ?? "free";
	const availableModels = getAvailableModels(tier);
	const activeModel = selectedModel ?? availableModels[0]?.id ?? "deepseek/deepseek-chat-v3:free";
	const dailyLimit = status?.dailyLimit ?? LIMITS[tier].dailyCommands;
	const usageToday = status?.usageToday ?? 0;
	const isDailyLimitReached = status !== null && usageToday >= dailyLimit;
	const isRateLimited = retryCountdown > 0 || isDailyLimitReached;

	// ── Chat hook ───────────────────────────────────────────────────────────
	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
		api: "/api/chat",
		maxSteps: 5,
		body: { model: activeModel },
		async onToolCall({ toolCall }) {
			if (!copilot) return { error: "Editor not ready" };
			try {
				return await copilot.executeTool(toolCall.toolName, toolCall.args);
			} catch (err: any) {
				return { error: err.message };
			}
		},
		onResponse() {
			// Refresh usage count after a successful response
			if (status) {
				setStatus((prev) => prev ? { ...prev, usageToday: prev.usageToday + 1 } : prev);
			}
		},
		onError(error) {
			try {
				const data = JSON.parse(error.message);
				if (data.retryAfterSeconds) {
					const secs = Number(data.retryAfterSeconds);
					setRetryCountdown(secs);
					setRateLimitError(`Rate limited — try again in ${secs}s`);
					return;
				}
				if (data.error?.includes("Daily limit")) {
					setRateLimitError(data.error);
					fetchStatus(); // re-fetch to sync usage count
					return;
				}
			} catch {
				// not JSON — fall through
			}
			if (error.message.includes("429") || error.message.toLowerCase().includes("too many")) {
				setRetryCountdown(60);
				setRateLimitError("Rate limited — try again in 60s");
			}
		},
	});

	// ── Auto-scroll to latest message ───────────────────────────────────────
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading]);

	// ─────────────────────────────────────────────────────────────────────────
	// Closed state — floating button
	// ─────────────────────────────────────────────────────────────────────────
	if (!isOpen) {
		return (
			<Button
				variant="outline"
				size="icon"
				id="copilot-toggle-btn"
				className="fixed bottom-5 right-5 z-50 rounded-full shadow-xl h-13 w-13 bg-background/90 backdrop-blur-sm border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-110 group"
				onClick={() => setIsOpen(true)}
				title="Open Dreamy Copilot"
			>
				<Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
			</Button>
		);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Open state — chat panel
	// ─────────────────────────────────────────────────────────────────────────
	return (
		<div
			id="copilot-panel"
			className="fixed bottom-5 right-5 z-50 w-[380px] flex flex-col bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
			style={{ height: "540px" }}
		>
			{/* ── Header ── */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20 flex-shrink-0">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
						<Sparkles className="w-3.5 h-3.5 text-primary" />
					</div>
					<div>
						<p className="text-sm font-semibold leading-none">Dreamy Copilot</p>
						<p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{tier} plan</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<ModelSelector 
						activeModelId={activeModel}
						availableModels={availableModels}
						onSelect={setSelectedModel}
					/>

					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 hover:bg-muted rounded-lg"
						onClick={() => setIsOpen(false)}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* ── Usage bar ── */}
			<div className="px-4 py-2 flex items-center gap-3 border-b border-border/30 bg-muted/10 flex-shrink-0">
				<div className="flex-1 bg-muted/40 rounded-full h-1.5 overflow-hidden">
					<div
						className={`h-full rounded-full transition-all duration-500 ${
							isDailyLimitReached ? "bg-destructive" : "bg-primary"
						}`}
						style={{ width: `${Math.min((usageToday / dailyLimit) * 100, 100)}%` }}
					/>
				</div>
				<span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
					{usageToday}/{dailyLimit} today
				</span>
				{tier === "free" && (
					<button
						onClick={() => router.push("/pricing")}
						className="text-[10px] text-primary hover:underline font-medium whitespace-nowrap"
					>
						Upgrade ↗
					</button>
				)}
			</div>

			{/* ── Messages ── */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full gap-3 text-center pb-4">
						<div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
							<Sparkles className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">How can I help?</p>
							<p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
								Ask me to edit your video — split clips, add text, delete elements.
							</p>
						</div>
						<div className="flex flex-col gap-1.5 w-full max-w-[280px] mt-2">
							{["Split first clip at 5 seconds", "Add 'Intro' text at 0s for 3s", "Show timeline state"].map((s) => (
								<button
									key={s}
									className="text-xs text-left px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
									onClick={() => {
										handleInputChange({ target: { value: s } } as any);
									}}
								>
									{s}
								</button>
							))}
						</div>
					</div>
				)}

				{messages.map((m) => (
					<div key={m.id} className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
						{m.role === "assistant" && (
							<div className="flex items-center gap-1.5 ml-1">
								<div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
									<Sparkles className="w-2.5 h-2.5 text-primary" />
								</div>
								<span className="text-[10px] text-muted-foreground font-medium">Copilot</span>
							</div>
						)}

						{m.content && (
							<div
								className={`px-3.5 py-2.5 rounded-2xl text-sm max-w-[88%] leading-relaxed ${
									m.role === "user"
										? "bg-primary text-primary-foreground rounded-tr-sm"
										: "bg-muted/60 border border-border/40 text-foreground rounded-tl-sm"
								}`}
							>
								{m.content}
							</div>
						)}

						{/* Tool invocation badges */}
						{m.toolInvocations && m.toolInvocations.length > 0 && (
							<div className="flex flex-col gap-1.5 items-start max-w-[88%]">
								{m.toolInvocations.map((inv) => (
									<ToolBadge
										key={inv.toolCallId}
										toolName={inv.toolName}
										done={inv.state === "result"}
									/>
								))}
							</div>
						)}
					</div>
				))}

				{/* Thinking indicator */}
				{isLoading && messages[messages.length - 1]?.role === "user" && <ThinkingIndicator />}

				{/* Rate limit banner */}
				{isRateLimited && (
					<div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3.5 py-3 flex flex-col gap-2.5">
						<p className="text-xs text-destructive font-medium">
							{retryCountdown > 0
								? `⏳ Rate limited — retry in ${retryCountdown}s`
								: (rateLimitError ?? "Daily limit reached.")}
						</p>
						{tier === "free" && (
							<Button
								size="sm"
								variant="outline"
								className="h-7 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive"
								onClick={() => router.push("/pricing")}
							>
								Upgrade to Pro for 200 commands/day
							</Button>
						)}
					</div>
				)}

				{/* Scroll anchor */}
				<div ref={bottomRef} />
			</div>

			{/* ── Input ── */}
			<div className="p-3 border-t border-border/40 bg-muted/10 flex-shrink-0">
				<form onSubmit={handleSubmit} className="flex gap-2 items-end">
					<Input
						id="copilot-input"
						value={input}
						onChange={handleInputChange}
						placeholder={
							isRateLimited
								? retryCountdown > 0
									? `Rate limited — ${retryCountdown}s`
									: "Daily limit reached"
								: "Ask Copilot to edit your video…"
						}
						disabled={isRateLimited || isLoading}
						className="flex-1 bg-background/60 text-sm border-border/50 rounded-xl disabled:opacity-50 resize-none"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								if ((input || "").trim() && !isLoading && !isRateLimited) {
									handleSubmit(e as any);
								}
							}
						}}
					/>
					<Button
						type="submit"
						size="icon"
						id="copilot-send-btn"
						disabled={!(input || "").trim() || isLoading || isRateLimited}
						className="h-9 w-9 rounded-xl flex-shrink-0"
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
