import { applyLeverUIRef } from '../merge-refs';

/** Combine the indicator's ref with a custom child SVG's ref. */
export function composeCheckboxRefs<ElementType extends Element>(
  parent: { readonly ref?: unknown },
  child?: { readonly ref?: unknown },
): (element: ElementType) => void {
  /** Deliver an element to each ref owner, including array refs. */
  return function notifyRefs(element: ElementType): void {
    applyLeverUIRef(parent.ref, element);
    applyLeverUIRef(child?.ref, element);
  };
}
