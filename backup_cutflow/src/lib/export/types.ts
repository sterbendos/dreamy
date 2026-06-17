export interface ExportEffects {
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export interface ExportVideoOptions {
  outputPath?: string;
  quality: 'high' | 'medium' | 'low';
  resolution: 'source' | '2160' | '1080' | '720';
  includeSubtitles: boolean;
  fps?: number;
  effects?: ExportEffects;
  preferGpu?: boolean;
  onProgress?: (progress: number, message: string) => void;
}

export interface ExportQuality {
  value: 'high' | 'medium' | 'low';
  label: string;
  bitrate: number;
}

export const EXPORT_QUALITIES: ExportQuality[] = [
  { value: 'high', label: 'High', bitrate: 10_000_000 },
  { value: 'medium', label: 'Medium', bitrate: 6_000_000 },
  { value: 'low', label: 'Low', bitrate: 3_000_000 },
];
