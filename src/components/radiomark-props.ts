import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';

type IntrinsicElement = keyof JSX.IntrinsicElements;
export type RadiomarkChoice<T extends string | boolean> =
  T | readonly (T | null)[] | ResponsiveValues<T>;
export type RadiomarkSize = 'xs' | 'sm' | 'md' | 'lg';
export type RadiomarkVariant = 'solid' | 'subtle' | 'outline' | 'inverted';

export interface RadiomarkBaseProps {
  /** Show the selection dot without adding radio semantics. */
  checked?: boolean | undefined;
  /** Show the disabled visual treatment. */
  disabled?: boolean | undefined;
  /** Select a finite mark size at supported breakpoints. */
  size?: RadiomarkChoice<RadiomarkSize> | undefined;
  /** Select a finite surface treatment at supported breakpoints. */
  variant?: RadiomarkChoice<RadiomarkVariant> | undefined;
  /** Add the surface background at supported breakpoints. */
  filled?: RadiomarkChoice<boolean> | undefined;
  /** Select a semantic color palette. */
  colorPalette?: string | undefined;
  /** Suppress default presentation while retaining state and class hooks. */
  unstyled?: boolean | undefined;
  /** Add a native class through the alternate HTML naming convention. */
  className?: string | undefined;
}

type NativeRadiomarkProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof RadiomarkBaseProps | 'as' | 'asChild'> &
      RadiomarkBaseProps &
      (As extends 'span' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildRadiomarkProps = Omit<
  JSX.IntrinsicElements['span'],
  keyof RadiomarkBaseProps | 'as' | 'asChild' | 'ref'
> &
  RadiomarkBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

/** Expose native attributes and caller-owned child composition. */
export type RadiomarkProps<As extends IntrinsicElement = 'span'> =
  NativeRadiomarkProps<As> | ChildRadiomarkProps;

export type RadiomarkRootProps = JSX.HTMLAttributes<HTMLElement> &
  RadiomarkBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderChild | undefined;
    className?: string;
    ref?: ((element: Element) => void) | undefined;
  };
