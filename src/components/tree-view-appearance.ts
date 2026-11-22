import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import type { ResponsiveBooleanValue } from '../styled-system/responsive-values';

export type TreeViewSize = 'xs' | 'sm' | 'md';
export type TreeViewVariant = 'subtle' | 'solid';

/** Finite Tree View presentation choices expressed as CSS attributes. */
export type TreeViewAppearance = {
  size?: FiniteResponsiveChoice<TreeViewSize>;
  variant?: FiniteResponsiveChoice<TreeViewVariant>;
  animateContent?: ResponsiveBooleanValue;
  colorPalette?: string;
  unstyled?: boolean;
  className?: string;
};
