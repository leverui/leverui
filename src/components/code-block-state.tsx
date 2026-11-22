import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { Api as ClipboardApi } from '@zag-js/clipboard';
import type { PropTypes } from '@zag-js/solid';
import type { CodeBlockHighlightMeta } from './code-block-types';

export type CodeBlockClipboard = Accessor<ClipboardApi<PropTypes>>;

export interface CodeBlockCollapsible {
  contentId: Accessor<string>;
  collapsed: Accessor<boolean>;
  /** Set disclosure state from a custom control. */
  setCollapsed: (collapsed: boolean) => void;
  /** Toggle disclosure state from a custom control. */
  toggleCollapsed: () => void;
}

export interface UseCodeBlockContext {
  code: Accessor<string>;
  language: Accessor<string | undefined>;
  meta: Accessor<CodeBlockHighlightMeta>;
  clipboard: CodeBlockClipboard;
  collapsible: CodeBlockCollapsible;
}

export interface CodeBlockContextProps {
  /** Render from the current Code Block context. */
  children: (context: UseCodeBlockContext) => JSX.Element;
}

const StateContext = createOptionalContext<UseCodeBlockContext>();

/** Scope Code Block behavior to its nearest root. */
export const CodeBlockStateProvider = StateContext;

/** Read code, metadata, copy state, and collapse state from the nearest root. */
export function useCodeBlockContext(): UseCodeBlockContext {
  const state = useOptionalContext(StateContext);
  if (!state) throw new Error('Code Block parts must be inside CodeBlockRoot.');
  return state;
}

/** Expose the nearest Code Block state through an idiomatic Solid render prop. */
export function CodeBlockContext(props: CodeBlockContextProps): JSX.Element {
  return <>{props.children(useCodeBlockContext())}</>;
}
