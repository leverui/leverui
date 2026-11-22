import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

export type PrimitiveNativeTag = keyof JSX.IntrinsicElements;

type CallbackRef<As extends PrimitiveNativeTag> = JSX.IntrinsicElements[As] extends {
  ref?: infer Ref;
}
  ? Extract<Ref, (element: never) => void>
  : never;

/**
 * The primitive's `asChild` and `render` composition props, accepting at most one. The primitive's
 * own `PolymorphicProps` allows both together; Lever's base and default prop
 * types use this so they spread into a part's exclusive props.
 */
export type PrimitiveCompositionProps<Tag extends PrimitiveNativeTag> =
  | { asChild?: NonNullable<PolymorphicProps<Tag>['asChild']>; render?: never }
  | { asChild?: never; render?: RenderFn<Tag, unknown> };

type DefaultProps<Tag extends PrimitiveNativeTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render'
> &
  Behavior & { as?: never; asChild?: never; render?: never };

type SelectedProps<As extends PrimitiveNativeTag, Behavior> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as: As;
    asChild?: never;
    render?: never;
    ref?: CallbackRef<NoInfer<As>> | undefined;
  };

type ChildProps<Tag extends PrimitiveNativeTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as?: never;
    /** @deprecated Prefer `render`; `asChild` keeps working. */
    asChild: NonNullable<PolymorphicProps<Tag>['asChild']>;
    render?: never;
    ref?: ((element: Element) => void) | undefined;
  };

/**
 * The primitive's composition path: `render` receives a props function to spread and
 * the part's state accessor. Lever types the state as `unknown`; narrow it or
 * read the family's context hook for typed state.
 */
type RenderedProps<Tag extends PrimitiveNativeTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as?: never;
    asChild?: never;
    render: RenderFn<Tag, unknown>;
    ref?: ((element: Element) => void) | undefined;
  };

/**
 * Type primitive-owned native, selected-tag, child, and `render` paths without
 * style-object props. `as`, `asChild`, and `render` are mutually exclusive.
 */
export type PrimitiveNativeElementProps<
  Tag extends PrimitiveNativeTag,
  Behavior,
  As extends PrimitiveNativeTag = Tag,
> =
  | DefaultProps<Tag, Behavior>
  | SelectedProps<As, Behavior>
  | ChildProps<Tag, Behavior>
  | RenderedProps<Tag, Behavior>;
