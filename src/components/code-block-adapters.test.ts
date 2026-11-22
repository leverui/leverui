import { expect, test, vi } from 'vitest';
import type { Highlighter } from 'shiki';
import { createHighlightJsAdapter, createShikiAdapter } from '../index';
import type {
  ShikiAdapterOptions,
  ShikiHighlightOptions,
  ShikiLineElement,
} from './code-block-adapter-shiki';

type Assignable<From, To> = [From] extends [To] ? true : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type RealShikiOptions = NonNullable<ShikiAdapterOptions<Highlighter>['highlightOptions']>;
export type RealShikiOptionAccepted = ExpectTrue<
  Assignable<{ mergeWhitespaces: 'never' }, RealShikiOptions>
>;
export type RealShikiInvalidOptionRejected = ExpectFalse<
  Assignable<{ mergeWhitespaces: 123 }, RealShikiOptions>
>;

/** Verify Shiki receives the active theme, language, and line metadata. */
function verifiesShikiAdapter(): void {
  let options: ShikiHighlightOptions | undefined;
  const dispose = vi.fn();
  const highlighter = {
    dispose,
    /** Capture the options and emulate one transformed syntax line. */
    codeToHtml(code: string, next: ShikiHighlightOptions): string {
      options = next;
      const line: ShikiLineElement = {};
      next.transformers?.[0]?.line?.(line, 2);
      return `<pre class="syntax"><code><span data-line="2">${code}</span></code></pre>`;
    },
  };
  const adapter = createShikiAdapter({
    /** Supply the same fixture when the adapter loads asynchronously. */
    async load() {
      return highlighter;
    },
    /** Keep the fixture available during server rendering. */
    loadSync() {
      return highlighter;
    },
    theme: { dark: 'night', light: 'day' },
  });
  const result = adapter.getHighlighter(highlighter)({
    code: 'const ready = true',
    language: 'tsx',
    meta: {
      colorScheme: 'light',
      highlightLines: [2],
      addedLineNumbers: [2],
      focusedLineNumbers: [2],
      wordWrap: true,
    },
  });
  expect(result).toEqual({
    highlighted: true,
    code: '<span data-line="2">const ready = true</span>',
  });
  expect(options?.theme).toBe('day');
  expect(options?.lang).toBe('tsx');
  const line: ShikiLineElement = {};
  options?.transformers?.[0]?.line?.(line, 2);
  expect(line.properties).toMatchObject({
    'data-line': 2,
    'data-highlight': '',
    'data-word-wrap': '',
    'data-diff': 'added',
    'data-focused': '',
  });
  adapter.unloadContext?.(highlighter);
  expect(dispose).toHaveBeenCalledOnce();
}

test('Shiki adapter maps syntax metadata and disposes its engine', verifiesShikiAdapter);

/** Verify Highlight.js wraps one-based lines and releases loaded languages. */
function verifiesHighlightJsAdapter(): void {
  const unregisterLanguage = vi.fn();
  const highlight = vi.fn(
    /** Return escaped fixture syntax without adding native wrappers. */
    (code: string) => ({ value: `<b>${code}</b>\nnext` }),
  );
  const highlighter = {
    highlight,
    /** Expose one loaded fixture language for disposal. */
    listLanguages() {
      return ['tsx'];
    },
    unregisterLanguage,
  };
  const adapter = createHighlightJsAdapter({
    /** Supply the fixture after asynchronous loading. */
    async load() {
      return highlighter;
    },
    highlightOptions: { ignoreIllegals: true },
  });
  const result = adapter.getHighlighter(highlighter)({
    code: 'ready',
    language: 'tsx',
    meta: { highlightLines: [1], removedLineNumbers: [2], focusedLineNumbers: [1] },
  });
  expect(highlight).toHaveBeenCalledWith('ready', {
    language: 'tsx',
    ignoreIllegals: true,
  });
  expect(result).toEqual({
    highlighted: true,
    code:
      '<span data-line="1" data-highlight data-focused><b>ready</b></span>\n' +
      '<span data-line="2" data-diff="removed">next</span>',
  });
  adapter.unloadContext?.(highlighter);
  expect(unregisterLanguage).toHaveBeenCalledWith('tsx');
}

test(
  'Highlight.js adapter preserves syntax lines and unloads languages',
  verifiesHighlightJsAdapter,
);
