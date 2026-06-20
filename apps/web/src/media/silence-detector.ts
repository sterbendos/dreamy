export interface SilenceCut {
	start: number;
	end: number;
}

export function detectSilence({
	samples,
	sampleRate,
	thresholdDb = -30,
	minSilenceDuration = 0.2, // seconds
	margin = 0.2, // seconds (padding around speech)
}: {
	samples: Float32Array;
	sampleRate: number;
	thresholdDb?: number;
	minSilenceDuration?: number;
	margin?: number;
}): SilenceCut[] {
	// Convert dB threshold to linear amplitude
	// dB = 20 * log10(amplitude) -> amplitude = 10^(dB/20)
	const thresholdLinear = Math.pow(10, thresholdDb / 20);
	const minSilenceSamples = Math.floor(minSilenceDuration * sampleRate);
	const marginSamples = Math.floor(margin * sampleRate);

	// Use a 10ms window to speed up detection
	const windowSize = Math.floor(sampleRate * 0.01);
	
	const rawSilenceSegments: { start: number; end: number }[] = [];
	let currentSilenceStartSample = -1;
	
	// Phase 1: Identify all raw chunks of silence
	for (let i = 0; i < samples.length; i += windowSize) {
		let maxAmplitude = 0;
		const end = Math.min(i + windowSize, samples.length);
		for (let j = i; j < end; j++) {
			const abs = Math.abs(samples[j]);
			if (abs > maxAmplitude) {
				maxAmplitude = abs;
			}
		}

		const isSilent = maxAmplitude < thresholdLinear;

		if (isSilent) {
			if (currentSilenceStartSample === -1) {
				currentSilenceStartSample = i;
			}
		} else {
			if (currentSilenceStartSample !== -1) {
				rawSilenceSegments.push({
					start: currentSilenceStartSample,
					end: i
				});
				currentSilenceStartSample = -1;
			}
		}
	}

	if (currentSilenceStartSample !== -1) {
		rawSilenceSegments.push({
			start: currentSilenceStartSample,
			end: samples.length
		});
	}

	// Phase 2: Filter by minSilenceDuration and apply Margins (auto-editor logic)
	const finalCuts: SilenceCut[] = [];

	for (const segment of rawSilenceSegments) {
		const durationSamples = segment.end - segment.start;
		
		// If the silence isn't long enough, ignore it (it's part of speech)
		if (durationSamples < minSilenceSamples) {
			continue;
		}

		// Apply margin (pad speech = shrink silence)
		// Move start of silence forward by margin
		let adjustedStart = segment.start + marginSamples;
		// Move end of silence backward by margin
		let adjustedEnd = segment.end - marginSamples;

		// The start of the file shouldn't necessarily push speech forward
		if (segment.start === 0) {
			adjustedStart = 0;
		}
		
		// The end of the file shouldn't pad beyond the end
		if (segment.end === samples.length) {
			adjustedEnd = samples.length;
		}

		// If after applying margins the silence becomes negative or 0, we don't cut
		if (adjustedStart < adjustedEnd) {
			finalCuts.push({
				start: adjustedStart / sampleRate,
				end: adjustedEnd / sampleRate,
			});
		}
	}

	return finalCuts;
}
