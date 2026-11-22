import { type JSX } from '@solidjs/web';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { RenderSvgChild } from '../styled-system/svg-child-props';
import type { CheckmarkSize, CheckmarkVariant } from './checkmark-options';

type IntrinsicElement = keyof JSX.IntrinsicElements;
export type CheckmarkChoice<T extends string | boolean> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

export interface CheckmarkBaseProps {
  /** Draw the checked glyph. */
  checked?: boolean | undefined;
  /** Draw the minus glyph in preference to the checked glyph. */
  indeterminate?: boolean | undefined;
  /** Show the disabled state without changing native SVG semantics. */
  disabled?: boolean | undefined;
  /** Select the authored SVG geometry at ordinary breakpoints. */
  size?: CheckmarkChoice<CheckmarkSize> | undefined;
  /** Select the authored surface treatment at ordinary breakpoints. */
  variant?: CheckmarkChoice<CheckmarkVariant> | undefined;
  /** Add a background at ordinary breakpoints. */
  filled?: CheckmarkChoice<boolean> | undefined;
  /** Select a semantic color palette. */
  colorPalette?: string | undefined;
  /** Omit default presentation while retaining the native SVG and glyph. */
  unstyled?: boolean | undefined;
  /** Add a native class through the alternate HTML naming convention. */
  className?: string | undefined;
}

type NativeCheckmarkProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof CheckmarkBaseProps | 'as' | 'asChild'> &
      CheckmarkBaseProps &
      (As extends 'svg' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildCheckmarkProps = Omit<
  JSX.IntrinsicElements['svg'],
  keyof CheckmarkBaseProps | 'as' | 'asChild' | 'ref'
> &
  CheckmarkBaseProps & {
    as?: never;
    asChild: RenderSvgChild;
    ref?: ((element: SVGSVGElement) => void) | undefined;
  };

export type CheckmarkProps<As extends IntrinsicElement = 'svg'> =
  NativeCheckmarkProps<As> | ChildCheckmarkProps;
export type CheckmarkRootProps = Omit<
  JSX.SvgSVGAttributes<SVGSVGElement>,
  keyof CheckmarkBaseProps | 'ref'
> &
  CheckmarkBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderSvgChild | undefined;
    className?: string;
    ref?: ((element: Element) => void) | undefined;
  };
