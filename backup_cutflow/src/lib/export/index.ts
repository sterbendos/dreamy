import type { TimelineState, BRollSegment } from '@/context/TimelineContext';
import type { CaptionStyle } from '@/context/CaptionContext';
import type { ExportVideoOptions } from './types';

/**
 * Unified video export API.
 *
 * Tries the fastest available path in this order:
 *   1. GPU-accelerated export (Tauri + wgpu) – applies colour-grade effects on GPU
 *   2. Standard Tauri PNG export (falls back if GPU unavailable)
 *   3. Browser-only WebCodecs export (falls back if Tauri unavailable)
 *
 * Returns the output file path (Tauri) or undefined (browser download).
 */
export async function exportVideo(
  state: TimelineState,
  captionStyle: CaptionStyle,
  transcript: any,
  effects: any,
  bRolls: BRollSegment[],
  motionGraphics: any,
  options: ExportVideoOptions,
): Promise<string | undefined> {
  const { onProgress } = options;

  // Try GPU compositor first (explicitly picks RTX 5070 over Intel UHD).
  // Falls back to standard Tauri PNG path on failure or timeout.
  if (isTauri()) {
    try {
      return await exportWithGpu(state, captionStyle, transcript, effects, bRolls, motionGraphics, options);
    } catch (gpuErr) {
      console.warn('[exportVideo] GPU export failed, falling back to standard Tauri path:', gpuErr);
      onProgress?.(0, 'GPU export unavailable – falling back to standard export');
    }
    return await exportTauri(state, captionStyle, transcript, effects, bRolls, motionGraphics, options);
  }

  // Pure browser export (WebCodecs or MediaRecorder) – last resort.
  await exportBrowser(state, captionStyle, transcript, effects, bRolls, motionGraphics, options);
  return undefined;
}

// ──────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────

function isTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    (('__TAURI__' in window) ||
      ('__TAURI_IPC__' in window) ||
      ('__TAURI_INTERNALS__' in window) ||
      !!(window as any).tauri ||
      !!(window as any).webviewWindow)
  );
}

async function exportWithGpu(
  state: TimelineState,
  captionStyle: CaptionStyle,
  transcript: any,
  effects: any,
  bRolls: BRollSegment[],
  motionGraphics: any,
  options: ExportVideoOptions,
): Promise<string> {
  const { invoke } = await import('@tauri-apps/api/core');
  const { save } = await import('@tauri-apps/plugin-dialog');
  const { writeFile, writeTextFile, mkdir, BaseDirectory } = await import('@tauri-apps/plugin-fs');
  const { appLocalDataDir, join } = await import('@tauri-apps/api/path');

  const outputPath = await (async () => {
    if (options.outputPath) return options.outputPath;
    const selected = await save({
      filters: [{ name: 'MP4 Video', extensions: ['mp4'] }],
      defaultPath: 'CutFlow_Export.mp4',
    });
    if (!selected) throw new Error('Export cancelled by user');
    return selected;
  })();

  options.onProgress?.(0.05, 'Initialising GPU compositor…');

  const initTimeout = 8000; // 8-second timeout for wgpu init
  try {
    await Promise.race([
      invoke('init_gpu_compositor', { width: 1920, height: 1080 }),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error(`GPU compositor init timed out after ${initTimeout}ms`)), initTimeout)
      ),
    ]);

    const fps = options.fps ?? 30;
    const tempPrefix = `cutflow_export_${crypto.randomUUID()}`;
    await mkdir(tempPrefix, { baseDir: BaseDirectory.AppLocalData, recursive: true });

    const { Compositor } = await import('@/lib/render/Compositor');
    const { convertFileSrc } = await import('@tauri-apps/api/core');

    // Load source video
    const sourceVideo = document.createElement('video');
    sourceVideo.src = convertFileSrc(state.source_video_path);
    sourceVideo.crossOrigin = 'anonymous';
    sourceVideo.muted = true;
    sourceVideo.preload = 'auto';
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout loading video')), 10000);
      sourceVideo.addEventListener('loadedmetadata', () => { clearTimeout(timeout); resolve(); }, { once: true });
      sourceVideo.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Failed to load video')); }, { once: true });
      sourceVideo.load();
    });

    const sourceSize = {
      width: sourceVideo.videoWidth || 1920,
      height: sourceVideo.videoHeight || 1080,
    };
    const outputSize = resolveOutputSize(sourceSize, state.aspectRatio, options.resolution);

    const canvas = document.createElement('canvas');
    const compositor = new Compositor(canvas);
    compositor.setSize(outputSize.width, outputSize.height);

    // Load b-rolls
    const loadedBRolls: { segment: typeof bRolls[0]; video: HTMLVideoElement }[] = [];
    for (const segment of (bRolls ?? [])) {
      if (!segment.path || segment.path.startsWith('mock://') || segment.path.startsWith('appdata/')) continue;
      const video = document.createElement('video');
      video.src = convertFileSrc(segment.path);
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.preload = 'auto';
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout loading b-roll')), 10000);
        video.addEventListener('loadedmetadata', () => { clearTimeout(timeout); resolve(); }, { once: true });
        video.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Failed to load b-roll')); }, { once: true });
        video.load();
      });
      loadedBRolls.push({ segment, video });
    }

    const keepSegments = state.edl
      .filter((s) => s.segment_type === 'keep' && s.end > s.start)
      .sort((a, b) => a.start - b.start);

    const totalDuration = keepSegments.reduce((t, s) => t + (s.end - s.start), 0);
    const totalFrames = Math.max(1, Math.ceil(totalDuration * fps));

    let frameIndex = 0;

    for (const segment of keepSegments) {
      const segmentFrames = Math.max(1, Math.ceil((segment.end - segment.start) * fps));
      for (let i = 0; i < segmentFrames; i++) {
        const sourceTimestamp = Math.min(
          segment.start + i * (1 / fps),
          segment.end - 0.000_001,
        );

        sourceVideo.currentTime = sourceTimestamp;
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            sourceVideo.removeEventListener('seeked', onSeeked);
            resolve();
          };
          sourceVideo.addEventListener('seeked', onSeeked, { once: true });
        });

        const activeBRolls = loadedBRolls
          .filter((item) => {
            const t = sourceTimestamp;
            return t >= item.segment.start && t < item.segment.start + item.segment.duration;
          })
          .map((item) => ({
            segment: item.segment,
            source: item.video,
          }));

        compositor.renderFrame({
          timestamp: sourceTimestamp,
          source: sourceVideo,
          bRolls: activeBRolls,
          transcript,
          captionsVisible: true,
          captionStyle,
          motionGraphics,
          effects,
          subtitlePosition: (captionStyle as any)?.position ?? 'bottom',
        });

        // Extract RGBA pixels from canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context');
        const imageData = ctx.getImageData(0, 0, outputSize.width, outputSize.height);
        const rgba = new Uint8Array(imageData.data.buffer);

        // Apply GPU colour-grade
        const brightness = options.effects?.brightness ?? 1.0;
        const contrast = options.effects?.contrast ?? 1.0;
        const saturation = options.effects?.saturation ?? 1.0;

        let processedRgba: Uint8Array;
        try {
          const result: number[] = await invoke('gpu_process_frame', {
            data: Array.from(rgba),
            width: outputSize.width,
            height: outputSize.height,
            brightness,
            contrast,
            saturation,
          });
          processedRgba = new Uint8Array(result);
        } catch {
          // GPU processing failed – use the source frame as-is
          processedRgba = rgba;
        }

        // Save as PNG
        const blob = await new Promise<Blob>((resolve) => {
          const offscreen = new OffscreenCanvas(outputSize.width, outputSize.height);
          const offCtx = offscreen.getContext('2d')!;
          const imageData2 = offCtx.createImageData(outputSize.width, outputSize.height);
          imageData2.data.set(processedRgba);
          offCtx.putImageData(imageData2, 0, 0);
          offscreen.convertToBlob({ type: 'image/png' }).then(resolve);
        });

        const arrayBuf = await blob.arrayBuffer();
        const uint8Arr = new Uint8Array(arrayBuf);
        const filename = `${tempPrefix}/frame_${String(frameIndex + 1).padStart(5, '0')}.png`;
        await writeFile(filename, uint8Arr, { baseDir: BaseDirectory.AppLocalData });

        frameIndex++;
        const progress = Math.min(0.8, (frameIndex / totalFrames) * 0.8);
        options.onProgress?.(progress, `GPU processing frame ${frameIndex}/${totalFrames}…`);
      }
    }

    // Generate subtitles (same as standard path)
    try {
      if (options.includeSubtitles && Array.isArray(transcript) && transcript.length > 0) {
        const { generateSrtForExport, normalizeTranscript } = await import('@/lib/export/subtitles');
        const { scanFacesForExport } = await import('@/lib/export/faceScanner');

        const normalized = normalizeTranscript(transcript);
        let facePlacements;
        try {
          facePlacements = await scanFacesForExport(state.source_video_path, normalized);
        } catch {
          // non-fatal
        }
        const ass = generateSrtForExport(normalized, state.edl, captionStyle, facePlacements);
        if (ass) {
          await writeTextFile(`${tempPrefix}/subtitles.ass`, ass, { baseDir: BaseDirectory.AppLocalData });
        }
      }
    } catch {
      // non-fatal
    }

    options.onProgress?.(0.85, 'Encoding with FFmpeg…');

    const appData = await appLocalDataDir();
    const tempDirAbs = await join(appData, tempPrefix);
    await invoke('export_frames_to_mp4', {
      temp_dir: tempDirAbs,
      output_path: outputPath,
      fps,
    });

    options.onProgress?.(1, 'Export complete');
    return outputPath;
  } finally {
    try {
      await invoke('gpu_release_compositor');
    } catch {
      // non-fatal
    }
  }
}

async function exportTauri(
  state: TimelineState,
  captionStyle: CaptionStyle,
  transcript: any,
  effects: any,
  bRolls: BRollSegment[],
  motionGraphics: any,
  options: ExportVideoOptions,
): Promise<string> {
  const { save } = await import('@tauri-apps/plugin-dialog');
  const { exportTimelineToTauriMp4 } = await import('@/lib/render/Exporter');

  const outputPath = await (async () => {
    if (options.outputPath) return options.outputPath;
    const selected = await save({
      filters: [{ name: 'MP4 Video', extensions: ['mp4'] }],
      defaultPath: 'CutFlow_Export.mp4',
    });
    if (!selected) throw new Error('Export cancelled by user');
    return selected;
  })();

  return exportTimelineToTauriMp4(
    state,
    {
      quality: options.quality,
      resolution: options.resolution,
      includeSubtitles: options.includeSubtitles,
      transcript,
      captionStyle,
      effects,
      bRolls,
      motionGraphics,
      onProgress: options.onProgress,
      fps: options.fps,
    },
    outputPath,
  );
}

async function exportBrowser(
  state: TimelineState,
  captionStyle: CaptionStyle,
  transcript: any,
  effects: any,
  bRolls: BRollSegment[],
  motionGraphics: any,
  options: ExportVideoOptions,
): Promise<void> {
  const { exportTimelineToMp4 } = await import('@/lib/render/Exporter');

  const blob = await exportTimelineToMp4(state, {
    quality: options.quality,
    resolution: options.resolution,
    includeSubtitles: options.includeSubtitles,
    transcript,
    captionStyle,
    effects,
    bRolls,
    motionGraphics,
    onProgress: options.onProgress,
    fps: options.fps,
  });

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CutFlow_Export.mp4';
  a.click();
  URL.revokeObjectURL(url);
}

// ──────────────────────────────────────────────
// Helpers (mirrored from Exporter.ts to avoid importing private functions)
// ──────────────────────────────────────────────

type VideoSize = { width: number; height: number };

function parseAspectRatio(aspectRatio: string): number | null {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (!w || !h) return null;
  return w / h;
}

function evenSize(width: number, height: number): VideoSize {
  return {
    width: Math.max(2, Math.round(width / 2) * 2),
    height: Math.max(2, Math.round(height / 2) * 2),
  };
}

function resolveOutputSize(
  sourceSize: VideoSize,
  aspectRatio: string,
  resolution: string,
): VideoSize {
  if (resolution === 'source') return evenSize(sourceSize.width, sourceSize.height);
  const height = Number(resolution);
  const ratio = parseAspectRatio(aspectRatio) ?? sourceSize.width / sourceSize.height;
  return evenSize(height * ratio, height);
}
