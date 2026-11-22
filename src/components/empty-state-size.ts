import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveBreakpoint,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { EmptyStateSize, ResponsiveEmptyStateSize } from './empty-state-props';

const sizes = new Set<string>(['sm', 'md', 'lg']);
type EmptyStateSizeAttribute = 'data-size' | `data-size-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Validate finite Empty State sizes at ordinary responsive breakpoints. */
export function readEmptyStateSize(
  value: ResponsiveEmptyStateSize | undefined,
): ResponsiveValues<EmptyStateSize> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError('Empty State size uses an unsupported breakpoint or value.');
  const result: ResponsiveValues<EmptyStateSize> = { base: 'md' };
  for (const breakpoint of responsiveBreakpoints) {
    const size = selected[breakpoint];
    if (size === undefined) continue;
    if (!sizes.has(size)) throw new TypeError(`Empty State size is unsupported: ${size}.`);
    result[breakpoint] = size as EmptyStateSize;
  }
  return result;
}

/** Expose size choices through stable native DOM attributes. */
export function emptyStateSizeAttributes(
  size: ResponsiveValues<EmptyStateSize>,
): Partial<Record<EmptyStateSizeAttribute, string | undefined>> {
  return {
    'data-size': size.base,
    'data-size-sm': size.sm,
    'data-size-md': size.md,
    'data-size-lg': size.lg,
    'data-size-xl': size.xl,
    'data-size-2xl': size['2xl'],
  };
}
