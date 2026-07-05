import * as React from "react";
import { Command } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/ui";
import { type ModelInfo, formatContextWindow } from "@/billing/tiers";

interface ModelSelectorProps {
	activeModelId: string;
	availableModels: ModelInfo[];
	onSelect: (modelId: string) => void;
	disabled?: boolean;
}

export function ModelSelector({ activeModelId, availableModels, onSelect, disabled }: ModelSelectorProps) {
	const [open, setOpen] = React.useState(false);
	
	const activeModel = availableModels.find((m) => m.id === activeModelId);

	// Group models by provider
	const groupedModels = React.useMemo(() => {
		const groups: Record<string, ModelInfo[]> = {};
		for (const model of availableModels) {
			if (!groups[model.provider]) {
				groups[model.provider] = [];
			}
			groups[model.provider].push(model);
		}
		return groups;
	}, [availableModels]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className="h-7 px-2 text-xs bg-muted/50 border-border/40 hover:bg-muted/80 justify-between min-w-[140px] max-w-[200px]"
				>
					<span className="truncate">{activeModel?.name ?? "Select model..."}</span>
					<ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0 border-border/40 shadow-xl rounded-xl bg-background/95 backdrop-blur-xl" align="end" sideOffset={8}>
				<Command className="bg-transparent" loop>
					<div className="flex items-center border-b border-border/40 px-3 py-2">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<Command.Input 
							placeholder="Search models..." 
							className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					
					<Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
						<Command.Empty className="py-6 text-center text-sm text-muted-foreground">
							No models found.
						</Command.Empty>

						{Object.entries(groupedModels).map(([provider, models]) => (
							<Command.Group 
								key={provider} 
								heading={provider.toUpperCase()}
								className="px-1 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground/70 tracking-wider"
							>
								{models.map((model) => (
									<Command.Item
										key={model.id}
										value={`${model.name} ${model.provider} ${model.strength}`}
										onSelect={() => {
											onSelect(model.id);
											setOpen(false);
										}}
										className={cn(
											"relative flex cursor-pointer select-none items-start rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
											activeModelId === model.id ? "bg-accent/50 text-accent-foreground" : ""
										)}
									>
										<div className="flex flex-col w-full gap-1">
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center gap-1.5 min-w-0">
													<span className="font-medium truncate">{model.name}</span>
													{model.tier === "free" && (
														<span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
															FREE
														</span>
													)}
													{model.tier === "pro" && (
														<span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
															PRO
														</span>
													)}
												</div>
												<span className="text-[10px] text-muted-foreground whitespace-nowrap tabular-nums shrink-0 ml-2">
													{formatContextWindow(model.contextWindow)}
												</span>
											</div>
											<p className="text-[10px] text-muted-foreground/80 leading-snug line-clamp-2">
												{model.strength}
											</p>
											<div className="flex items-center justify-between text-[10px] text-muted-foreground/70 tabular-nums">
												<span>
													{model.costPer1MTokens ? model.costPer1MTokens : "$0.00 — free tier"}
												</span>
												<span className="text-muted-foreground/60">
													★ {model.qualityScore}/100
												</span>
											</div>
										</div>
									</Command.Item>
								))}
							</Command.Group>
						))}
					</Command.List>

					<div className="border-t border-border/40 p-2 text-[10px] text-muted-foreground flex items-center justify-between bg-muted/20">
						<span>Type to search, Esc to close</span>
						<span>{availableModels.length} models</span>
					</div>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
