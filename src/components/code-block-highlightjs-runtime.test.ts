import core from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import { expect, test } from 'vitest';
import { createHighlightJsAdapter } from '../index';

/** Require independent line wrappers when a syntax token crosses a newline. */
function verifiesMultilineTokens(): void {
  const highlighter = core.newInstance();
  highlighter.registerLanguage('tsx', typescript);
  const adapter = createHighlightJsAdapter({
    /** Supply the real engine to the adapter's asynchronous contract. */
    async load() {
      return highlighter;
    },
  });
  const source = '/* alpha\nbeta */\nconst ready = true';

  try {
    const result = adapter.getHighlighter(highlighter)({
      code: source,
      language: 'tsx',
      meta: { showLineNumbers: true, highlightLines: [2] },
    });
    const code = document.createElement('code');
    code.innerHTML = result.code;
    const lines = [...code.querySelectorAll<HTMLElement>('[data-line]')];

    expect(result.highlighted).toBe(true);
    expect(
      lines.map(
        /** Read the one-based source number assigned to each line. */
        (line) => line.getAttribute('data-line'),
      ),
    ).toEqual(['1', '2', '3']);
    expect(
      lines.every(
        /** Keep every source line directly under the native code element. */
        (line) => line.parentElement === code,
      ),
    ).toBe(true);
    expect(
      lines.map(
        /** Check that no wrapper includes text from another source line. */
        (line) => line.textContent,
      ),
    ).toEqual(['/* alpha', 'beta */', 'const ready = true']);
    expect(lines[0]?.querySelector('.hljs-comment')?.textContent).toBe('/* alpha');
    expect(lines[1]?.querySelector('.hljs-comment')?.textContent).toBe('beta */');
    expect(lines[1]?.getAttribute('data-highlight')).toBe('');
    expect(code.textContent).toBe(source);
  } finally {
    adapter.unloadContext?.(highlighter);
  }
  expect(highlighter.listLanguages()).toEqual([]);
}

test('real Highlight.js tokens keep multiline metadata independent', verifiesMultilineTokens);
