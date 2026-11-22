import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ChildAttributes, RenderChild } from '../styled-system/child-props';
import { composeCheckboxRefs } from './checkbox-ref';

export type PrimitivePartGetProps = (
  childProps?: JSX.HTMLAttributes<HTMLElement>,
) => JSX.HTMLAttributes<HTMLElement>;

/** Preserve a parent's ref when the primitive renders a Checkbox part through asChild. */
export function renderCheckboxPartChild(
  renderChild: RenderChild,
  parent: { readonly ref?: unknown },
  getPrimitiveProps: PrimitivePartGetProps,
): JSX.Element {
  /** Merge the consumer's attributes with live primitive behavior and both refs. */
  function getChildProps(childProps?: ChildAttributes): ChildAttributes {
    const primitiveProps = getPrimitiveProps(childProps);
    // The primitive's native callback has already composed behavior and consumer props.
    return mergeProps(primitiveProps, {
      ref: composeCheckboxRefs(parent, childProps),
    }) as ChildAttributes;
  }

  return renderChild(getChildProps);
}
