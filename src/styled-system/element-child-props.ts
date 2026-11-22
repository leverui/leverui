import { type JSX } from '@solidjs/web';

/** Attributes safe to spread onto a consumer-selected HTML or SVG element. */
export type ElementChildAttributes = Omit<JSX.HTMLAttributes<Element>, 'ref'> & {
  ref?: ((element: Element) => void) | undefined;
};

/** Return merged attributes when the selected element is not fixed in advance. */
/** Merged attributes for a selected element, which always carry the component's class. */
export type ElementChildProps = ElementChildAttributes & { class: string };
export type GetElementChildProps = (childProps?: ElementChildAttributes) => ElementChildProps;
