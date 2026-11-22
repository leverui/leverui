import { createMemo, createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { codeLanguage, highlightGuideCode } from '../lib/guide-syntax-highlight';
import type { MarkdownComponents, MarkdownElementProps } from './markdown';
import { MarkdownTable } from './guide-props-table';
import { SiteIcon } from './site-icon';
import '../styles/guide-code-block.css';

/** Render colored tokens as text nodes in both static HTML and hydrated pages. */
function HighlightedSource(props: {
  source: string;
  languageClass?: string | undefined;
  label?: string | undefined;
}): JSX.Element {
  const lines = createMemo(
    /** Retokenize when a live code example changes. */
    () => highlightGuideCode(props.source, codeLanguage(props.languageClass, props.label)),
  );
  return (
    <For each={lines()}>
      {/** Preserve Shiki's line boundaries and final newline. */}
      {(line, index) => (
        <>
          {index() > 0 ? '\n' : ''}
          <For each={line}>
            {/** Color syntax without injecting source as HTML. */}
            {(token) => <span style={{ color: token.color }}>{token.content}</span>}
          </For>
        </>
      )}
    </For>
  );
}

/** Highlight a fenced Markdown code node while preserving inline code. */
function MarkdownCode(props: MarkdownElementProps): JSX.Element {
  const source = createMemo(
    /** Read only text nodes from the parsed Markdown code element. */
    () =>
      props.node.children
        .map(
          /** Ignore non-text children in a fenced source node. */
          (child) => (child.type === 'text' ? child.value : ''),
        )
        .join(''),
  );
  return (
    <Show when={!props.inline} fallback={<code class={props.class}>{props.children}</code>}>
      <code class={props.class}>
        <HighlightedSource source={source()} languageClass={props.class} />
      </code>
    </Show>
  );
}

/** Give fenced Markdown snippets the same floating copy action as examples. */
function MarkdownPre(props: MarkdownElementProps): JSX.Element {
  return (
    <GuideCodeBlock class={props.class} floatingCopy>
      {props.children}
    </GuideCodeBlock>
  );
}

/** Render copyable source with dark syntax highlighting in static HTML. */
export function GuideCodeBlock(props: {
  children?: JSX.Element;
  class?: string | undefined;
  floatingCopy?: boolean | undefined;
  label?: string | undefined;
  showToolbar?: boolean | undefined;
  source?: string | undefined;
}): JSX.Element {
  const [copyStatus, setCopyStatus] = createSignal<'idle' | 'success' | 'error'>('idle');
  let codeElement: HTMLPreElement | undefined;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  /** Copy the source without including the toolbar or token markup. */
  async function copyCode(): Promise<void> {
    const source = props.source ?? codeElement?.textContent ?? '';
    if (!source) return;
    try {
      await navigator.clipboard.writeText(source);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(
      /** Restore the action label after the confirmation is readable. */
      () => setCopyStatus('idle'),
      1800,
    );
  }

  onSettled(
    /** Cancel the copy confirmation timer when the block unmounts. */
    () => () => clearTimeout(resetTimer),
  );

  return (
    <div class={['guide-code-block', { 'is-floating-copy': props.floatingCopy }]}>
      {props.showToolbar !== false && (
        <div class="guide-code-toolbar">
          <span>{props.label ?? 'Code'}</span>
          <button type="button" onClick={copyCode} aria-live="polite">
            {props.floatingCopy && <SiteIcon name="copy" />}
            <span>
              {copyStatus() === 'success'
                ? 'Copied'
                : copyStatus() === 'error'
                  ? 'Copy failed'
                  : 'Copy code'}
            </span>
          </button>
        </div>
      )}
      <pre ref={codeElement} class={props.class}>
        {props.source === undefined ? (
          props.children
        ) : (
          <code>
            <HighlightedSource source={props.source} label={props.label} />
          </code>
        )}
      </pre>
    </div>
  );
}

/** Reuse syntax highlighting and the code toolbar in maintained Markdown. */
export const guideMarkdownComponents: MarkdownComponents = {
  pre: MarkdownPre,
  code: MarkdownCode,
  table: MarkdownTable,
};
