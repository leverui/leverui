import type {
  CodeBlockAdapter,
  CodeBlockHighlightMeta,
  CodeBlockHighlighterProps,
  CodeBlockHighlightResult,
} from './code-block-types';

export interface HighlightJsResult {
  value: string;
}

export interface HighlightJsHighlighter {
  /** Return escaped markup for the selected language. */
  highlight(
    code: string,
    options: { language: string; ignoreIllegals?: boolean },
  ): HighlightJsResult;
  /** List languages owned by this instance before cleanup. */
  listLanguages(): string[];
  /** Release a registered language when the adapter leaves. */
  unregisterLanguage(language: string): void;
}

export interface HighlightJsAdapterOptions<Highlighter extends HighlightJsHighlighter> {
  /** Load the consumer-owned highlighter asynchronously. */
  load: () => Promise<Highlighter>;
  /** Supply the highlighter during server rendering when available. */
  loadSync?: (() => Highlighter) | undefined;
  highlightOptions?: { language?: string; ignoreIllegals?: boolean } | undefined;
}

/** Describe one highlighted line without embedding source in an attribute. */
function lineAttributes(meta: CodeBlockHighlightMeta | undefined, line: number): string {
  const attributes = [`data-line="${line}"`];
  if (meta?.highlightLines?.includes(line)) attributes.push('data-highlight');
  if (meta?.wordWrap) attributes.push('data-word-wrap');
  if (meta?.addedLineNumbers?.includes(line)) attributes.push('data-diff="added"');
  else if (meta?.removedLineNumbers?.includes(line)) attributes.push('data-diff="removed"');
  if (meta?.focusedLineNumbers?.includes(line)) attributes.push('data-focused');
  return attributes.join(' ');
}

/** Wrap Highlight.js output with line metadata for Code Block styling. */
function decorateLines(value: string, meta: CodeBlockHighlightMeta | undefined): string {
  const lines: string[] = [];
  const openTags: string[] = [];
  let lineMarkup = '';
  let hasText = false;

  /** Close syntax spans for this line and reopen them on the next one. */
  function finishLine(): void {
    const closingTags = '</span>'.repeat(openTags.length);
    const content = hasText ? lineMarkup : `${lineMarkup} `;
    lines.push(`<span ${lineAttributes(meta, lines.length + 1)}>${content}${closingTags}</span>`);
    lineMarkup = openTags.join('');
    hasText = false;
  }

  for (const token of value.split(/(<\/?span\b[^>]*>|\n)/g)) {
    if (!token) continue;
    if (token === '\n') {
      finishLine();
    } else if (token.startsWith('</span')) {
      openTags.pop();
      lineMarkup += token;
    } else if (token.startsWith('<span')) {
      openTags.push(token);
      lineMarkup += token;
    } else {
      lineMarkup += token;
      hasText = true;
    }
  }
  finishLine();
  return lines.join('\n');
}

/** Adapt a consumer-supplied Highlight.js instance without bundling it. */
export function createHighlightJsAdapter<Highlighter extends HighlightJsHighlighter>(
  options: HighlightJsAdapterOptions<Highlighter>,
): CodeBlockAdapter {
  return {
    loadContext: options.load,
    loadContextSync: options.loadSync,
    /** Unregister languages loaded for this adapter instance. */
    unloadContext(context) {
      // Contexts originate only from this adapter's typed load functions.
      const highlighter = context as Highlighter | null;
      highlighter?.listLanguages().forEach(
        /** Remove each language from the outgoing highlighter. */
        (language) => highlighter.unregisterLanguage(language),
      );
    },
    /** Highlight code when the supplied language set has loaded. */
    getHighlighter(context) {
      /** Render escaped Highlight.js tokens with per-line attributes. */
      function highlight({
        code,
        language,
        meta,
      }: CodeBlockHighlighterProps): CodeBlockHighlightResult {
        if (!context) return { code, highlighted: false };
        // Contexts originate only from this adapter's typed load functions.
        const highlighter = context as Highlighter;
        const result = highlighter.highlight(code.trim(), {
          language: language ?? 'plaintext',
          ...options.highlightOptions,
        });
        return { highlighted: true, code: decorateLines(result.value, meta) };
      }

      return highlight;
    },
  };
}
