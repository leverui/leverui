import { splitProps } from '../utils/split-props';
import { mergeProps } from '../utils/merge-part-props';
import { warn } from '@zag-js/utils';
import { type Accessor, untrack } from 'solid-js';
import { Dynamic, type JSX } from '@solidjs/web';
import type { Assign } from '../types';

type ElementType = keyof JSX.IntrinsicElements;

type JsxElements = {
  [E in ElementType]: PrimitiveComponent<E>;
};

export type EmptyState = Record<never, never>;

// intentionally `any`: the props are spread onto arbitrary user components, `unknown` would break that
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
export type RenderProps = Record<string, any>;

// call it to get the part's props, passing your own to merge them in
export type PropsFn<T extends ElementType> = (userProps?: JSX.IntrinsicElements[T]) => RenderProps;

// the render fn runs once, so the state has to be an accessor
export type RenderFn<T extends ElementType, State> = (
  props: PropsFn<T>,
  state: Accessor<State>,
) => JSX.Element;

export type PolymorphicProps<T extends ElementType, State = EmptyState> = {
  /**
   * Use the provided child element as the default rendered element, combining their props and behavior.
   *
   * @deprecated Use `render` instead. It takes the same props function, plus the part's state.
   * `asChild` is still supported, but `render` is preferred.
   */
  asChild?: ((props: PropsFn<T>) => JSX.Element) | undefined;
  /**
   * Render the part as a custom element, combining their props and behavior.
   *
   * Call `props()` to spread the part's props, passing your own to merge them rather than overwrite them.
   * The state arrives as an accessor:
   * `render={(props, state) => <button {...props({ onClick: mine })}>{state().open}</button>}`
   */
  render?: RenderFn<T, State> | undefined;
};
export type HTMLProps<E extends ElementType> = JSX.IntrinsicElements[E];
export type HTMLPrimitiveProps<E extends ElementType> = Assign<HTMLProps<E>, PolymorphicProps<E>>;

/**
 * The state of the part, forwarded to the `render` function. Set by the component, not the consumer.
 */
interface StateProp {
  state?: unknown;
}

// The factory accepts any element's props and any part state; each part narrows them.
/* eslint-disable @typescript-eslint/no-explicit-any -- see above */
interface FactoryProps extends Record<string, any> {
  asChild?: ((props: PropsFn<any>) => JSX.Element) | undefined;
  render?: RenderFn<any, any> | undefined;
  state?: unknown;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// `any` for the state so a render fn can declare the shape its part provides
type PrimitiveComponent<E extends ElementType> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
  props: Assign<JSX.IntrinsicElements[E], PolymorphicProps<E, any> & StateProp>,
) => JSX.Element;

const EMPTY_STATE: EmptyState = Object.freeze({});

/** With render. */
const withRender = <T extends ElementType>(Component: T) => {
  /** Render the Components primitive component. */
  const PrimitiveComponent: PrimitiveComponent<T> = (props) => {
    const [localProps, parentProps] = splitProps(props as FactoryProps, [
      'asChild',
      'render',
      'state',
    ]);

    // the rendering mode is chosen once, when the part is created
    const { asChild, render } = untrack(() => ({
      asChild: localProps.asChild,
      render: localProps.render,
    }));

    warn(
      Boolean(asChild) && Boolean(render),
      '[leverui] `asChild` and `render` cannot be used together. Prefer `render`.',
    );

    // the caller applies the props itself, so only the ref is left to us
    const [, restProps] = splitProps(parentProps, ['ref']);
    /** Props fn. */
    const propsFn = (userProps?: JSX.IntrinsicElements[T]) =>
      mergeProps(restProps, userProps ?? {});

    if (render) {
      return render(propsFn, () => localProps.state ?? EMPTY_STATE);
    }

    if (asChild) {
      return asChild(propsFn);
    }

    // @ts-expect-error generic element props can't be expressed against Dynamic
    return <Dynamic component={Component} {...parentProps} />;
  };

  return PrimitiveComponent;
};

/** Jsx factory. */
function jsxFactory() {
  const cache = new Map();

  return new Proxy(withRender, {
    /** Apply. */
    apply(_target, _thisArg, argArray) {
      return withRender(argArray[0]);
    },
    /** Create, or reuse, the component for an element name. */
    get(_, element) {
      const asElement = element as ElementType;
      if (!cache.has(asElement)) {
        cache.set(asElement, withRender(asElement));
      }
      return cache.get(asElement);
    },
  }) as unknown as JsxElements;
}

export const primitive = jsxFactory();
