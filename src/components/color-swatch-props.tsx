import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { ColorSwatchShape, ColorSwatchSize } from './color-swatch-choices';
import type { NativeElementTag } from './native-element-props';

export type ColorSwatchChoice<T extends string> = T | readonly (T | null)[] | ResponsiveValues<T>;

export interface ColorSwatchBaseProps {
  /** Set the previewed CSS color. */
  value: string;
  /** Select a finite swatch size at supported breakpoints. */
  size?: ColorSwatchChoice<ColorSwatchSize> | undefined;
  /** Select a finite silhouette at supported breakpoints. */
  shape?: ColorSwatchChoice<ColorSwatchShape> | undefined;
  /** Suppress authored presentation while retaining native attributes. */
  unstyled?: boolean | undefined;
}

type NativeSwatchProps<As extends NativeElementTag> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof ColorSwatchBaseProps | 'as' | 'asChild'
> &
  ColorSwatchBaseProps &
  (As extends 'span' ? { as?: As } : { as: As }) & { asChild?: never };
type ChildSwatchProps = Omit<
  JSX.IntrinsicElements['span'],
  keyof ColorSwatchBaseProps | 'as' | 'asChild' | 'ref'
> &
  ColorSwatchBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type ColorSwatchProps<As extends NativeElementTag = 'span'> =
  NativeSwatchProps<As> | ChildSwatchProps;

export type ColorSwatchRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof ColorSwatchBaseProps
> &
  ColorSwatchBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

type ColorSwatchDefaults = Partial<Omit<ColorSwatchRuntimeProps, 'ref'>>;

export interface ColorSwatchPropsProviderProps {
  value: ColorSwatchDefaults | Accessor<ColorSwatchDefaults>;
  children: JSX.Element;
}

const ColorSwatchContext = createOptionalContext<Accessor<ColorSwatchDefaults>>();

/** Supply reactive native and appearance defaults to descendant swatches. */
export function ColorSwatchPropsProvider(props: ColorSwatchPropsProviderProps): JSX.Element {
  /** Read changing provider defaults inside each consumer's tracked scope. */
  function readDefaults(): ColorSwatchDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ColorSwatchContext value={readDefaults}>{props.children}</ColorSwatchContext>;
}

/** Merge nearest swatch defaults with live instance props. */
export function useColorSwatchProps(instance: ColorSwatchRuntimeProps): ColorSwatchRuntimeProps {
  const inherited = useOptionalContext(ColorSwatchContext);
  return mergeProps(
    /** Give explicit swatch props precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
