import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

export type ComponentIntrinsicElement = keyof JSX.IntrinsicElements;

type IntrinsicCallbackRef<As extends ComponentIntrinsicElement> =
  JSX.IntrinsicElements[As] extends { ref?: infer Ref }
    ? Extract<Ref, (element: never) => void>
    : never;

type NativeProps<Tag extends ComponentIntrinsicElement, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render'
> &
  Behavior & { as?: never; asChild?: never; render?: never };

type SelectedProps<As extends ComponentIntrinsicElement, Behavior> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as: As;
    asChild?: never;
    render?: never;
    ref?: IntrinsicCallbackRef<NoInfer<As>>;
  };

type ChildProps<Tag extends ComponentIntrinsicElement, Behavior, ChildRenderer> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as?: never;
    /** @deprecated Prefer `render`; `asChild` keeps working. */
    asChild: ChildRenderer;
    render?: never;
    ref?: ((element: Element) => void) | undefined;
  };

/**
 * The primitive's composition path: `render` receives a props function to spread and
 * the part's state accessor, typed here as `unknown`.
 */
type RenderedProps<Tag extends ComponentIntrinsicElement, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'as' | 'asChild' | 'render' | 'ref'
> &
  Behavior & {
    as?: never;
    asChild?: never;
    render: RenderFn<Tag, unknown>;
    ref?: ((element: Element) => void) | undefined;
  };

/** Type native, selected, and caller-owned child elements independently. */
export type ComponentElementProps<
  Tag extends ComponentIntrinsicElement,
  Behavior = object,
  As extends ComponentIntrinsicElement = Tag,
  ChildRenderer = NonNullable<PolymorphicProps<Tag>['asChild']>,
> =
  | NativeProps<Tag, Behavior>
  | SelectedProps<As, Behavior>
  | ChildProps<Tag, Behavior, ChildRenderer>
  | RenderedProps<Tag, Behavior>;
