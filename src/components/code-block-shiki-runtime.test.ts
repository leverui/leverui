import { createHighlighter } from 'shiki';
import { expect, test } from 'vitest';
import { createShikiAdapter } from '../index';

/** Check actual Shiki output after the adapter adds Lever UI line metadata. */
async function verifiesRealShikiOutput(): Promise<void> {
  const highlighter = await createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: ['typescript'],
  });
  const adapter = createShikiAdapter({
    /** Reuse the loaded engine when the provider requests its async path. */
    async load() {
      return highlighter;
    },
    /** Make the same engine available for a synchronous render. */
    loadSync() {
      return highlighter;
    },
    theme: { dark: 'github-dark', light: 'github-light' },
  });

  try {
    const result = adapter.getHighlighter(highlighter)({
      code: 'const ready = true',
      language: 'typescript',
      meta: { colorScheme: 'light', highlightLines: [1], wordWrap: true },
    });
    expect(result.highlighted).toBe(true);
    expect(result.code).toMatch(/data-line="1"/);
    expect(result.code).toContain('data-highlight');
    expect(result.code).toContain('data-word-wrap');
    expect(result.code).toContain('ready');
    expect(result.code).not.toContain('<pre');
    expect(result.code).not.toContain('<code');
  } finally {
    adapter.unloadContext?.(highlighter);
  }
}

test('Code Block adapter processes a real Shiki highlighter', verifiesRealShikiOutput);
