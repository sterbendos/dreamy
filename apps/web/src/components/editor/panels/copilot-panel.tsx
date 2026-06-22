"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiChat02Icon, Cancel01Icon, MailSend01Icon as Send01Icon } from "@hugeicons/core-free-icons";

import { useEditor } from "@/editor/use-editor";

const FREE_MODELS = [
	{ id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B" },
	{ id: "google/gemma-7b-it:free", name: "Gemma 7B" },
	{ id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" }
];

export function CopilotPanel() {
	const [isOpen, setIsOpen] = useState(false);
	const [model, setModel] = useState(FREE_MODELS[0].id);
	const copilot = useEditor((e) => e.copilot);
	
	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
		api: "/api/chat",
		maxSteps: 5, // Allow multi-step tool calls
		body: { model },
		async onToolCall({ toolCall }) {
			if (copilot) {
				try {
					const result = await copilot.executeTool(toolCall.toolName, toolCall.args);
					return result;
				} catch (err: any) {
					return { error: err.message };
				}
			}
			return { error: "Copilot not ready" };
		}
	});

	if (!isOpen) {
		return (
			<Button
				variant="outline"
				size="icon"
				className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg h-12 w-12 bg-background border-border/50 text-foreground"
				onClick={() => setIsOpen(true)}
			>
				<HugeiconsIcon icon={AiChat02Icon} className="w-6 h-6" />
			</Button>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 w-[350px] h-[500px] bg-card border border-border/50 rounded-xl shadow-2xl flex flex-col overflow-hidden">
			{/* Header */}
			<div className="h-12 border-b border-border/50 flex items-center justify-between px-4 bg-muted/30">
				<div className="flex items-center gap-2">
					<HugeiconsIcon icon={AiChat02Icon} className="w-4 h-4 text-primary" />
					<select 
						value={model} 
						onChange={(e) => setModel(e.target.value)}
						className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
					>
						{FREE_MODELS.map(m => (
							<option key={m.id} value={m.id} className="bg-background text-foreground">{m.name}</option>
						))}
					</select>
				</div>
				<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => setIsOpen(false)}>
					<HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
				</Button>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-4">
				<div className="flex flex-col gap-4">
					{messages.length === 0 && (
						<div className="text-center text-muted-foreground text-sm mt-10">
							How can I help you edit this video?
						</div>
					)}
					{messages.map((m) => (
						<div key={m.id} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
							{m.content && (
								<div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
									{m.content}
								</div>
							)}
							{m.toolInvocations?.map((toolInvocation) => {
								const { toolName, toolCallId, state } = toolInvocation;
								if (state === 'result') {
									return (
										<div key={toolCallId} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
											✓ Executed {toolName}
										</div>
									);
								} else {
									return (
										<div key={toolCallId} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded animate-pulse">
											Executing {toolName}...
										</div>
									);
								}
							})}
						</div>
					))}
					{isLoading && messages[messages.length - 1]?.role === 'user' && (
						<div className="text-xs text-muted-foreground animate-pulse">Thinking...</div>
					)}
				</div>
			</ScrollArea>

			{/* Input */}
			<div className="p-3 border-t border-border/50 bg-background/50">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						value={input}
						onChange={handleInputChange}
						placeholder="E.g., Split the video at 5 seconds..."
						className="flex-1 bg-card text-sm"
					/>
					<Button type="submit" size="icon" disabled={!input || isLoading}>
						<HugeiconsIcon icon={Send01Icon} className="w-4 h-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}
