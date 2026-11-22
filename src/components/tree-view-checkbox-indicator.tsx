import { children, Match, Switch } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useTreeViewNodeContext } from '../primitives/components/tree-view';

export interface TreeViewNodeCheckboxIndicatorProps {
  /** Shown while the node is checked. */
  children?: JSX.Element;
  /** Shown while only some of the node's descendants are checked. */
  indeterminate?: JSX.Element;
  /** Shown while the node is unchecked. */
  fallback?: JSX.Element;
}

/**
 * Show the content that matches the current node's checked state.
 *
 * The primitive uses `NodeIndicator type="checked"` for this; Lever
 * keeps it so the checkbox content can still be chosen in one place.
 */
export function TreeViewNodeCheckboxIndicator(
  props: TreeViewNodeCheckboxIndicatorProps,
): JSX.Element {
  const nodeState = useTreeViewNodeContext();
  const checked = children(
    /** Resolve the checked content once per render. */
    () => props.children,
  );
  const indeterminate = children(
    /** Resolve the indeterminate content once per render. */
    () => props.indeterminate,
  );
  const fallback = children(
    /** Resolve the unchecked content once per render. */
    () => props.fallback,
  );
  return (
    <Switch fallback={fallback()}>
      <Match when={nodeState().checked === 'indeterminate' && indeterminate()}>
        {indeterminate()}
      </Match>
      <Match when={nodeState().checked === true && checked()}>{checked()}</Match>
    </Switch>
  );
}
