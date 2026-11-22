import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { NativeBox } from './native-box';
import type { TextStyleProps } from '../styled-system/text-style';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type NativeBoxProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], 'as' | 'asChild'> &
      TextStyleProps &
      (As extends 'div' ? { as?: As } : { as: As }) & { asChild?: never }
  : never;
type ChildBoxProps = Omit<JSX.IntrinsicElements['div'], 'as' | 'asChild' | 'ref'> &
  TextStyleProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: Element) => void) | undefined;
  };

/** Accept selected native tags or one caller-owned child without styling props. */
export type BoxProps<As extends IntrinsicElement = IntrinsicElement> =
  NativeBoxProps<As> | ChildBoxProps;

/** Expose the native Box adapter under its selected intrinsic prop contract. */
export const Box = NativeBox as <As extends IntrinsicElement = 'div'>(
  props: BoxProps<As>,
) => JSX.Element;
