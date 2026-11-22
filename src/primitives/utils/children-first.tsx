import { children, type ChildrenReturn } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface ChildrenFirstProps {
  /** The children to run first. */
  readonly content: JSX.Element;
  /** Render the element that holds them, given the children already run. */
  readonly children: (content: ChildrenReturn) => JSX.Element;
}

/**
 * Run some children before rendering the element that holds them. A popover or dialog
 * counts its title and description as they render, and its content's attributes depend on
 * that count. On the server the attributes are written before the children otherwise, so the
 * content would lose its reference to a title it has.
 */
export function ChildrenFirst(props: ChildrenFirstProps): JSX.Element {
  const content = children(() => props.content);
  content();
  return props.children(content);
}
