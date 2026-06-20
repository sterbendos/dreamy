"use client";

import React, { useState } from "react";
import { useEditor } from "@/editor/use-editor";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { Captions } from "lucide-react";
import { extractTimelineAudio } from "@/media/mediabunny";
import { decodeAudioToFloat32 } from "@/media/audio";
import { detectSilence } from "@/media/silence-detector";
import { Spinner } from "@/components/ui/spinner";
import { useElementSelection } from "@/timeline/hooks/element/use-element-selection";
import { toast } from "sonner";
import { mediaTimeFromSeconds, addMediaTime } from "@/wasm";

export function AutoCutButton() {
	const [isProcessing, setIsProcessing] = useState(false);
	const editor = useEditor();
	const { selectedElements } = useElementSelection();

	const handleAutoCut = async () => {
		if (selectedElements.length === 0) {
			toast.error("Please select an audio or video clip first.");
			return;
		}

		setIsProcessing(true);

		try {
			const selectedElementRef = editor.timeline.getElementsWithTracks({
				elements: selectedElements,
			})[0];

			if (!selectedElementRef) {
				toast.error("Could not find the selected element.");
				return;
			}

			const { element, track } = selectedElementRef;
			const mediaAssets = editor.media.getAssets();

			toast.loading("Extracting audio...", { id: "autocut" });

			// Create a single dummy track with just this element to extract its audio directly
			const dummyTracks = {
				overlay: [],
				main: track.type === "main" ? { ...track, elements: [element] } : { id: "main-0", type: "main", elements: [] },
				audio: track.type === "audio" ? [{ ...track, elements: [element] }] : [],
			} as any; // Using any since we don't need full track conformity for extraction

			const audioBlob = await extractTimelineAudio({
				tracks: dummyTracks,
				mediaAssets,
				totalDuration: addMediaTime({ a: element.startTime, b: element.duration }).ticks,
			});

			toast.loading("Analyzing silence...", { id: "autocut" });

			const { samples, sampleRate } = await decodeAudioToFloat32({
				audioBlob,
				sampleRate: 44100,
			});

			const cuts = detectSilence({ samples, sampleRate, thresholdDb: -35, minSilenceDuration: 0.4 });

			if (cuts.length === 0) {
				toast.success("No silence found to cut.", { id: "autocut" });
				return;
			}

			toast.loading(`Found ${cuts.length} silent segments. Cutting...`, { id: "autocut" });

			const sortedCuts = cuts.sort((a, b) => b.start - a.start);
			const elementsToDelete: { trackId: string; elementId: string }[] = [];

			for (const cut of sortedCuts) {
				const cutStartTicks = mediaTimeFromSeconds({ seconds: cut.start }).ticks;
				const cutEndTicks = mediaTimeFromSeconds({ seconds: cut.end }).ticks;

				const elementStart = element.startTime.ticks;
				const elementEnd = addMediaTime({ a: element.startTime, b: element.duration }).ticks;

				if (cutStartTicks >= elementEnd || cutEndTicks <= elementStart) {
					continue;
				}

				if (cutEndTicks < elementEnd) {
					// Split at the end of the silence.
					editor.timeline.splitElements({
						elements: [{ trackId: track.id, elementId: element.id }],
						splitTime: { ticks: cutEndTicks },
					});
				}

				if (cutStartTicks > elementStart) {
					// Split at the start of the silence. The resulting element is the silence itself.
					const middleElements = editor.timeline.splitElements({
						elements: [{ trackId: track.id, elementId: element.id }],
						splitTime: { ticks: cutStartTicks },
					});
					elementsToDelete.push(...middleElements);
				} else if (cutStartTicks <= elementStart && cutEndTicks > elementStart) {
					// The silence starts before the element and ends inside it. The remaining left element is silence.
					elementsToDelete.push({ trackId: track.id, elementId: element.id });
				}
			}

			if (elementsToDelete.length > 0) {
				editor.timeline.deleteElements({ elements: elementsToDelete });
			}

			toast.success(`Auto-Cut complete! Cut ${elementsToDelete.length} segments.`, { id: "autocut" });

			// Deselect to reset selection state properly
			editor.selection.clearSelection();

		} catch (err) {
			console.error("AutoCut failed", err);
			toast.error("Auto-Cut failed: " + (err instanceof Error ? err.message : String(err)), { id: "autocut" });
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						disabled={isProcessing}
						onClick={handleAutoCut}
						className="rounded-sm"
					>
						{isProcessing ? <Spinner /> : <HugeiconsIcon icon={MagicWand01Icon} />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Auto-Cut Silence</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function AutoSubtitlesButton() {
	const [isProcessing, setIsProcessing] = useState(false);
	const editor = useEditor();
	const { selectedElements } = useElementSelection();

	const handleAutoSubtitles = async () => {
		if (selectedElements.length === 0) {
			toast.error("Please select an audio or video clip first.");
			return;
		}

		setIsProcessing(true);

		try {
			const selectedElementRef = editor.timeline.getElementsWithTracks({
				elements: selectedElements,
			})[0];

			if (!selectedElementRef) {
				toast.error("Could not find the selected element.");
				return;
			}

			const { element, track } = selectedElementRef;
			const mediaAssets = editor.media.getAssets();

			toast.loading("Extracting audio...", { id: "autosub" });

			const dummyTracks = {
				overlay: [],
				main: track.type === "main" ? { ...track, elements: [element] } : { id: "main-0", type: "main", elements: [] },
				audio: track.type === "audio" ? [{ ...track, elements: [element] }] : [],
			} as any;

			const audioBlob = await extractTimelineAudio({
				tracks: dummyTracks,
				mediaAssets,
				totalDuration: addMediaTime({ a: element.startTime, b: element.duration }).ticks,
			});

			toast.loading("Loading Whisper model (WebGPU)...", { id: "autosub" });

			const { samples, sampleRate } = await decodeAudioToFloat32({
				audioBlob,
				sampleRate: 16000, // Whisper expects 16kHz
			});

			const transformers = await import("@huggingface/transformers");
			const transcriber = await transformers.pipeline(
				"automatic-speech-recognition",
				"onnx-community/whisper-tiny.en",
				{ device: "webgpu", dtype: "fp32" }
			);

			toast.loading("Transcribing audio...", { id: "autosub" });

			const output = await transcriber(samples, {
				chunk_length_s: 30,
				stride_length_s: 5,
				return_timestamps: true,
			});

			const chunks = (output as any).chunks as { text: string; timestamp: [number, number] }[];

			if (!chunks || chunks.length === 0) {
				toast.success("No speech found.", { id: "autosub" });
				return;
			}

			toast.loading(`Found ${chunks.length} segments. Adding to timeline...`, { id: "autosub" });

			const textTrackId = editor.timeline.addTrack({ type: "text" });

			for (const chunk of chunks) {
				const start = chunk.timestamp[0];
				const end = chunk.timestamp[1] ?? (start + 2); // Default to 2s if no end
				const durationTicks = mediaTimeFromSeconds({ seconds: end - start }).ticks;

				const textElement = {
					type: "text" as const,
					name: "Subtitle",
					startTime: addMediaTime({ a: element.startTime, b: mediaTimeFromSeconds({ seconds: start }) }),
					duration: { ticks: durationTicks },
					trimStart: { ticks: 0 },
					trimEnd: { ticks: durationTicks },
					params: {
						text: chunk.text.trim(),
						fontSize: 48,
						fillColor: "#ffffff",
						strokeColor: "#000000",
						strokeWidth: 2,
						fontFamily: "Inter"
					}
				};

				editor.timeline.insertElement({
					element: textElement as any,
					placement: { trackId: textTrackId, time: textElement.startTime }
				});
			}

			toast.success("Auto-Subtitles complete!", { id: "autosub" });
			editor.selection.clearSelection();

		} catch (err) {
			console.error("AutoSubtitles failed", err);
			toast.error("Auto-Subtitles failed: " + (err instanceof Error ? err.message : String(err)), { id: "autosub" });
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						disabled={isProcessing}
						onClick={handleAutoSubtitles}
						className="rounded-sm"
					>
						{isProcessing ? <Spinner /> : <Captions className="size-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Auto-Subtitles</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
