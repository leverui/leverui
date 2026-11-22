import { createMemo, untrack, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { mergeChildProps, type ChildAttributes, type RenderChild } from './child-props';

/** Render one caller-owned child with live native layout attributes. */
export function renderNativeLayoutChild(
  family: string,
  renderer: RenderChild | undefined,
  attributes: Accessor<JSX.HTMLAttributes<HTMLElement>>,
  content: Accessor<JSX.Element>,
): JSX.Element {
  if (!renderer) throw new Error(`${family} asChild renderer is missing.`);
  const childParent = createMemo(
    /** Keep content and native attributes reactive under the child renderer. */
    () => ({ ...attributes(), children: content() }),
  );
  const childProps = untrack(
    /** Create one stable proxy for callers that spread child props once. */
    () => mergeChildProps(childParent),
  );

  /** Combine caller attributes with the current layout attributes. */
  function getChildProps(overrides?: ChildAttributes): ChildAttributes {
    return overrides ? mergeChildProps(childParent, overrides) : childProps;
  }

  return untrack(
    /** Preserve the native child while the layout selection changes. */
    () => renderer(getChildProps),
  );
}
