import { readResponsiveBooleans } from '../styled-system/responsive-values';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';
import type { TreeViewAppearance, TreeViewSize, TreeViewVariant } from './tree-view-appearance';

const sizes = new Set<string>(['xs', 'sm', 'md']);
const variants = new Set<string>(['subtle', 'solid']);

/** Serialize an explicit responsive boolean without losing false values. */
function booleanAttribute(value: boolean | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

/** Reflect finite Tree View choices for static breakpoint selectors. */
export function treeViewAttributes(props: TreeViewAppearance): Record<string, string | undefined> {
  const size = readFiniteResponsiveChoice<TreeViewSize>(props.size, sizes, 'md', 'Tree View size');
  const variant = readFiniteResponsiveChoice<TreeViewVariant>(
    props.variant,
    variants,
    'subtle',
    'Tree View variant',
  );
  const motion = readResponsiveBooleans(props.animateContent);
  if (!motion) throw new TypeError('Tree View motion has an unsupported breakpoint or value.');
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
    'data-animate-content': booleanAttribute(motion.base ?? false),
    'data-animate-content-sm': booleanAttribute(motion.sm),
    'data-animate-content-md': booleanAttribute(motion.md),
    'data-animate-content-lg': booleanAttribute(motion.lg),
    'data-animate-content-xl': booleanAttribute(motion.xl),
    'data-animate-content-2xl': booleanAttribute(motion['2xl']),
    'data-lui-color-palette': props.colorPalette,
  };
}
