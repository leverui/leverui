import type { FiniteResponsiveChoice } from './finite-responsive-choice';

/** Finite Button sizes with authored stylesheet selectors. */
export const buttonSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Finite Button variants with authored stylesheet selectors. */
export const buttonVariants = ['solid', 'subtle', 'surface', 'outline', 'ghost', 'plain'] as const;

export type ButtonSize = (typeof buttonSizes)[number];
export type ButtonVariant = (typeof buttonVariants)[number];

/** Finite Button presentation choices backed by the default stylesheet. */
export type ButtonAppearance = {
  size?: FiniteResponsiveChoice<ButtonSize> | undefined;
  variant?: FiniteResponsiveChoice<ButtonVariant> | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
};
