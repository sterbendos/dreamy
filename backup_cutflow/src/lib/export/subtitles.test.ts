import { describe, expect, test } from 'vitest';
import { generateSrtForExport, normalizeTranscript } from './subtitles';

describe('subtitle export helpers', () => {
  test('normalizes transcript arrays and transcript payload objects', () => {
    expect(normalizeTranscript({
      transcript: [
        { text: ' hello ', start: 1, end: 1.2 },
        { text: '', start: 2, end: 3 },
        { text: 'bad', start: 4, end: 3 },
      ],
    })).toEqual([{ text: 'hello', start: 1, end: 1.2 }]);
  });

  test('maps source word timings into the exported keep-only timeline', () => {
    const ass = generateSrtForExport(
      [
        { text: 'first', start: 1, end: 1.4 },
        { text: 'cut', start: 5.1, end: 5.3 },
        { text: 'second', start: 11, end: 11.4 },
      ],
      [
        { start: 0, end: 2, segment_type: 'keep' },
        { start: 5, end: 10, segment_type: 'user-deleted' },
        { start: 10, end: 12, segment_type: 'keep' },
      ]
    );

    // Output should be in ASS format
    expect(ass).toContain('[Script Info]');
    expect(ass).toContain('[V4+ Styles]');
    expect(ass).toContain('[Events]');
    // 'first' and 'second' should appear as dialogue lines
    expect(ass).toContain('first');
    expect(ass).toContain('second');
    // 'cut' falls in a user-deleted segment and must be excluded
    expect(ass).not.toContain('cut');
    // Dialogue lines use ASS timestamps
    expect(ass).toContain('Dialogue:');
  });
});
