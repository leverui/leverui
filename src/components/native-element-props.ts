import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';

export type NativeElementTag = keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements;

type CallbackRef<As extends NativeElementTag> = JSX.IntrinsicElements[As] extends {
  ref?: infer Ref;
}
  ? Extract<Ref, (element: never) => void>
  : never;

type DefaultProps<Tag extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior
> &
  Behavior & { as?: never; asChild?: never };

type SelectedProps<As extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof Behavior | 'ref'
> &
  Behavior & { as: As; asChild?: never; ref?: CallbackRef<NoInfer<As>> | undefined };

type ChildProps<Tag extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'ref'
> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: Element) => void };

/** Type native, selected-tag, and caller-owned child paths without object styling props. */
export type NativeElementProps<
  Tag extends NativeElementTag,
  Behavior,
  As extends NativeElementTag = Tag,
> = DefaultProps<Tag, Behavior> | SelectedProps<As, Behavior> | ChildProps<Tag, Behavior>;
