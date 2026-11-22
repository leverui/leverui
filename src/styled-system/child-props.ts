import { mergeProps } from '../primitives/utils';
import { type Accessor } from 'solid-js';
import { mergeProps as mergeReactiveProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { mergeRefs as mergeCallbackRefs } from '../merge-refs';

export type ChildAttributes = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> & {
  ref?: ((element: HTMLElement) => void) | undefined;
};
export type GetChildProps = (childProps?: ChildAttributes) => ChildAttributes;
export type RenderChild = (getProps: GetChildProps) => JSX.Element;

/** Forward an element to both functional refs when a child supplies its own. */
function mergeChildRefs(
  parentRef: JSX.HTMLAttributes<HTMLElement>['ref'],
  childRef: ChildAttributes['ref'],
): ChildAttributes['ref'] {
  if (typeof parentRef !== 'function') return childRef;
  if (typeof childRef !== 'function') return parentRef;

  return mergeCallbackRefs(parentRef, childRef);
}

/** Merge child classes, styles, events, and refs with styled parent props. */
export function mergeChildProps(
  parentProps: Accessor<JSX.HTMLAttributes<HTMLElement>>,
  childProps?: ChildAttributes,
): ChildAttributes {
  const ref = mergeChildRefs(parentProps().ref, childProps?.ref);
  return mergeReactiveProps(
    /** Recompute merged values when the styled parent's attributes change. */
    () => ({ ...mergeProps(parentProps(), childProps), ref }),
  );
}
