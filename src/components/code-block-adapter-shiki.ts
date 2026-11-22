import type {
  CodeBlockAdapter,
  CodeBlockHighlightMeta,
  CodeBlockHighlighterProps,
  CodeBlockHighlightResult,
} from './code-block-types';

export interface ShikiLineElement {
  properties?: Record<string, unknown> | undefined;
}

export interface ShikiTransformer {
  /** Annotate one syntax line before Shiki serializes it. */
  line?: (element: ShikiLineElement, line: number) => void;
}

export interface ShikiHighlightOptions {
  theme: string;
  lang: string;
  transformers?: ShikiTransformer[];
}

export interface ShikiHighlighter<Options = ShikiHighlightOptions> {
  /** Convert source to syntax HTML with engine-specific options. */
  codeToHtml(code: string, options: Options): string;
  /** Release optional language and worker resources. */
  dispose?(): void;
}

export interface ShikiAdapterOptions<Highlighter extends ShikiHighlighter> {
  /** Load the consumer-owned highlighter asynchronously. */
  load: () => Promise<Highlighter>;
  /** Supply the same highlighter synchronously for server rendering when available. */
  loadSync?: (() => Highlighter) | undefined;
  highlightOptions?: Partial<Parameters<Highlighter['codeToHtml']>[1]> | undefined;
  theme: string | Record<string, string>;
}

/** Keep only the syntax-marked contents of Shiki's pre and code wrappers. */
function removeWrapperTags(html: string): string {
  return html
    .replace(/<pre[^>]*>/, '')
    .replace(/<\/pre>$/, '')
    .replace(/<code[^>]*>/, '')
    .replace(/<\/code>$/, '');
}

/** Add Code Block line metadata to Shiki's line elements. */
function lineTransformer(meta: CodeBlockHighlightMeta | undefined): ShikiTransformer {
  return {
    /** Mark highlighted, wrapped, diff, and focused lines for recipe styling. */
    line(element, line) {
      const properties = (element.properties ??= {});
      properties['data-line'] = line;
      properties['data-highlight'] = meta?.highlightLines?.includes(line) ? '' : undefined;
      properties['data-word-wrap'] = meta?.wordWrap ? '' : undefined;
      properties['data-diff'] = meta?.addedLineNumbers?.includes(line)
        ? 'added'
        : meta?.removedLineNumbers?.includes(line)
          ? 'removed'
          : undefined;
      properties['data-focused'] = meta?.focusedLineNumbers?.includes(line) ? '' : undefined;
    },
  };
}

/** Adapt a consumer-supplied Shiki highlighter without bundling Shiki. */
export function createShikiAdapter<Highlighter extends ShikiHighlighter>(
  options: ShikiAdapterOptions<Highlighter>,
): CodeBlockAdapter {
  return {
    loadContext: options.load,
    loadContextSync: options.loadSync,
    /** Release Shiki's worker and language resources when the provider leaves. */
    unloadContext(context) {
      // Contexts originate only from this adapter's typed load functions.
      (context as Highlighter | null)?.dispose?.();
    },
    /** Resolve a highlighter that falls back to plain text while loading. */
    getHighlighter(context) {
      /** Render syntax HTML with the active theme and line metadata. */
      function highlight({
        code,
        language,
        meta,
      }: CodeBlockHighlighterProps): CodeBlockHighlightResult {
        if (!context) return { code, highlighted: false };
        const scheme = meta?.colorScheme ?? 'dark';
        const theme = typeof options.theme === 'string' ? options.theme : options.theme[scheme];
        if (!theme) throw new Error(`Code Block theme not found for color scheme: ${scheme}`);
        // Contexts originate only from this adapter's typed load functions.
        const highlighter = context as Highlighter;
        // The adapter supplies the required theme and language after consumer options.
        const highlighterOptions = {
          ...options.highlightOptions,
          theme,
          lang: language ?? 'plaintext',
          transformers: [lineTransformer(meta), ...(options.highlightOptions?.transformers ?? [])],
        } as Parameters<Highlighter['codeToHtml']>[1];
        return {
          highlighted: true,
          code: removeWrapperTags(highlighter.codeToHtml(code, highlighterOptions)),
        };
      }

      return highlight;
    },
  };
}
