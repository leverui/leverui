import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import type { TextStyleProps } from '../styled-system/text-style';

export type SquareSize =
  string | number | readonly (string | number | null)[] | ResponsiveValues<string | number>;

/** The width and height value shared by Square and Circle. */
export interface SquareSizeOptions extends TextStyleProps {
  size?: SquareSize | undefined;
  unstyled?: boolean | undefined;
}

/** Expose native shape props with one component-specific size selection. */
export type SizedBoxProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  SquareSizeOptions,
  As
>;
