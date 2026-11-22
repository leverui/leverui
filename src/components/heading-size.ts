import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type { HeadingSizeChoice } from './heading-props';

export const headingSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;
export type HeadingSize = (typeof headingSizes)[number];
const allowedSizes = new Set<string>(headingSizes);

/** Narrow a string to one of Heading's authored size selectors. */
function isHeadingSize(value: string): value is HeadingSize {
  return allowedSizes.has(value);
}

/** Validate Heading's finite sizes and ordinary responsive breakpoints. */
export function readHeadingSizes(
  value: HeadingSizeChoice | undefined,
): ResponsiveValues<HeadingSize> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError('Heading size uses an unsupported breakpoint or value.');
  const sizes: ResponsiveValues<HeadingSize> = value === undefined ? { base: 'xl' } : {};
  for (const breakpoint of responsiveBreakpoints) {
    const size = selected[breakpoint];
    if (size === undefined) continue;
    if (!isHeadingSize(size)) throw new TypeError(`Heading size is unsupported: ${size}.`);
    sizes[breakpoint] = size;
  }
  return sizes;
}
