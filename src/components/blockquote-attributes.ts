import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { BlockquoteJustify, BlockquoteVariant } from './blockquote-choices';

export interface BlockquoteAttributes {
  'data-variant': BlockquoteVariant | undefined;
  'data-variant-sm': BlockquoteVariant | undefined;
  'data-variant-md': BlockquoteVariant | undefined;
  'data-variant-lg': BlockquoteVariant | undefined;
  'data-variant-xl': BlockquoteVariant | undefined;
  'data-variant-2xl': BlockquoteVariant | undefined;
  'data-justify': BlockquoteJustify | undefined;
  'data-justify-sm': BlockquoteJustify | undefined;
  'data-justify-md': BlockquoteJustify | undefined;
  'data-justify-lg': BlockquoteJustify | undefined;
  'data-justify-xl': BlockquoteJustify | undefined;
  'data-justify-2xl': BlockquoteJustify | undefined;
}

/** Reflect finite Blockquote choices for authored breakpoint selectors. */
export function blockquoteAttributes(
  variants: ResponsiveValues<BlockquoteVariant>,
  justify: ResponsiveValues<BlockquoteJustify>,
): BlockquoteAttributes {
  return {
    'data-variant': variants.base,
    'data-variant-sm': variants.sm,
    'data-variant-md': variants.md,
    'data-variant-lg': variants.lg,
    'data-variant-xl': variants.xl,
    'data-variant-2xl': variants['2xl'],
    'data-justify': justify.base,
    'data-justify-sm': justify.sm,
    'data-justify-md': justify.md,
    'data-justify-lg': justify.lg,
    'data-justify-xl': justify.xl,
    'data-justify-2xl': justify['2xl'],
  };
}
