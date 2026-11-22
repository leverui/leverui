import {
  readScrollAreaSizes,
  readScrollAreaVariants,
  type ScrollAreaAppearance,
} from './scroll-area-choices';

/** Reflect finite Scroll Area choices on the native machine root. */
export function scrollAreaAttributes(appearance: ScrollAreaAppearance): ScrollAreaAttributes {
  const size = readScrollAreaSizes(appearance.size);
  const variant = readScrollAreaVariants(appearance.variant);
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
    'data-variant': variant.base,
    'data-variant-sm': variant.sm,
    'data-variant-md': variant.md,
    'data-variant-lg': variant.lg,
    'data-variant-xl': variant.xl,
    'data-variant-2xl': variant['2xl'],
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}

type ScrollAreaBreakpoint = '' | '-sm' | '-md' | '-lg' | '-xl' | '-2xl';
type ScrollAreaChoiceAttribute = `data-${'size' | 'variant'}${ScrollAreaBreakpoint}`;
type ScrollAreaAttributes = Partial<
  Record<ScrollAreaChoiceAttribute | 'data-unstyled', string | undefined>
>;
