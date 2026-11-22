export type CodeBlockColorScheme = 'light' | 'dark' | (string & {});

export interface CodeBlockHighlightMeta {
  highlightLines?: number[] | undefined;
  showLineNumbers?: boolean | undefined;
  wordWrap?: boolean | undefined;
  removedLineNumbers?: number[] | undefined;
  addedLineNumbers?: number[] | undefined;
  focusedLineNumbers?: number[] | undefined;
  colorScheme?: CodeBlockColorScheme | undefined;
}

export interface CodeBlockHighlighterProps {
  code: string;
  language?: string | undefined;
  meta?: CodeBlockHighlightMeta | undefined;
}

export interface CodeBlockHighlightResult {
  code: string;
  highlighted: boolean;
}

export type CodeBlockHighlighter = (props: CodeBlockHighlighterProps) => CodeBlockHighlightResult;

export interface CodeBlockAdapter {
  /** Load an optional engine after the client mounts. */
  loadContext?: (() => Promise<unknown>) | undefined;
  /** Supply an engine synchronously for initial and server rendering. */
  loadContextSync?: (() => unknown) | undefined;
  /** Return escaped, trusted syntax HTML or signal an unhighlighted result. */
  getHighlighter: (context: unknown) => CodeBlockHighlighter;
  /** Release an engine when the adapter changes or leaves. */
  unloadContext?: ((context: unknown) => void) | undefined;
}
