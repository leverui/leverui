import { useClipboard } from '../primitives/components/clipboard';
import { createMemo, createSignal, createUniqueId, untrack } from 'solid-js';
import type { CodeBlockRootBaseProps } from './code-block-props';
import type { UseCodeBlockContext } from './code-block-state';

export type CodeBlockRootStateProps = Pick<
  CodeBlockRootBaseProps,
  | 'code'
  | 'language'
  | 'meta'
  | 'maxLines'
  | 'contentId'
  | 'defaultColorScheme'
  | 'copyTimeout'
  | 'onCopy'
>;

/** Decide whether source initially exceeds its visible line limit. */
function exceedsMaxLines(code: string, maxLines: number | undefined): boolean {
  return maxLines !== undefined && code.split('\n').length > maxLines;
}

/** Coordinate reactive source, clipboard, and disclosure state for one root. */
export function useCodeBlockRootState(props: CodeBlockRootStateProps): UseCodeBlockContext {
  const code = createMemo(
    /** Trim the displayed and copied source. */
    () => props.code.trim(),
  );
  const meta = createMemo(
    /** Preserve explicit metadata while providing a dark syntax theme fallback. */
    () => ({
      ...props.meta,
      colorScheme: props.meta?.colorScheme ?? props.defaultColorScheme ?? 'dark',
    }),
  );
  const clipboard = useClipboard(
    /** Keep Zag's clipboard value and timeout synchronized with root props. */
    () => ({
      value: code(),
      timeout: props.copyTimeout ?? 1000,
      /** Notify only when a copy operation succeeds. */
      onStatusChange(details) {
        if (details.copied) props.onCopy?.();
      },
    }),
  );
  const [collapsed, setCollapsed] = createSignal(
    untrack(
      /** Establish the same initial disclosure state during SSR and hydration. */
      () => exceedsMaxLines(code(), props.maxLines),
    ),
  );
  const generatedContentId = `${createUniqueId()}-content`;

  /** Resolve a stable generated ID unless the root supplies one explicitly. */
  function contentId(): string {
    return props.contentId ?? generatedContentId;
  }

  /** Set the current collapsed state from compound controls. */
  function setCollapseState(next: boolean): void {
    setCollapsed(next);
  }

  /** Toggle the visible number of code lines. */
  function toggleCollapsed(): void {
    setCollapsed(
      /** Invert the current disclosure choice without reading a stale value. */
      (previous) => !previous,
    );
  }

  return {
    code,
    /** Read a changing language when an adapter re-highlights the source. */
    language: () => props.language,
    meta,
    clipboard,
    collapsible: { contentId, collapsed, setCollapsed: setCollapseState, toggleCollapsed },
  };
}
