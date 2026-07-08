"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

export function AiChatPanel() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
		{ role: "ai", content: "I'm ready to edit. What should we do to this project?" }
	]);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const togglePanel = () => setIsOpen(!isOpen);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		
		setMessages(prev => [...prev, { role: "user", content: input }]);
		const query = input;
		setInput("");

		// Simulate AI thinking and performing a timeline action
		setTimeout(() => {
			if (query.toLowerCase().includes("b-roll")) {
				setMessages(prev => [...prev, { role: "ai", content: "Searching local footage for relevant b-roll... I've added a clip of the ocean to the timeline." }]);
			} else if (query.toLowerCase().includes("lower third") || query.toLowerCase().includes("graphics")) {
				setMessages(prev => [...prev, { role: "ai", content: "Generating a kinetic text overlay using our motion graphics engine. It's on track V2." }]);
			} else {
				setMessages(prev => [...prev, { role: "ai", content: "I've processed that edit on the timeline for you." }]);
			}
		}, 1200);
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isOpen]);

	return (
		<>
			{/* Floating Toggle Button */}
			<motion.button
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				onClick={togglePanel}
				className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-transform hover:scale-110 active:scale-95"
				aria-label="Toggle AI Assistant"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			</motion.button>

			{/* Sliding Panel */}
			<motion.div
				initial={{ x: "100%", opacity: 0 }}
				animate={{ x: isOpen ? 0 : "100%", opacity: isOpen ? 1 : 0 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[400px] border-l border-border bg-background shadow-2xl flex flex-col pt-16 sm:pt-0"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-md">
					<div className="flex items-center gap-3">
						<div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
						<h3 className="font-medium text-sm text-foreground">Agent Workspace</h3>
					</div>
					<button onClick={togglePanel} className="text-muted-foreground hover:text-foreground">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
					{messages.map((msg, i) => (
						<div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
							<div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm ${
								msg.role === "user" 
									? "bg-foreground text-background rounded-tr-sm" 
									: "bg-secondary text-secondary-foreground rounded-tl-sm border border-border/50"
							}`}>
								{msg.content}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-md">
					<form onSubmit={handleSubmit} className="relative flex items-center">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask AI to edit your video..."
							className="w-full h-12 pl-5 pr-12 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
						/>
						<button 
							type="submit" 
							disabled={!input.trim()}
							className="absolute right-1.5 h-9 w-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition-transform active:scale-95 disabled:active:scale-100"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="13 6 19 12 13 18"></polyline>
							</svg>
						</button>
					</form>
					<div className="flex justify-between items-center mt-3 px-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
						<span>Powered by MCP</span>
						<span>⌘L to focus</span>
					</div>
				</div>
			</motion.div>
		</>
	);
}
