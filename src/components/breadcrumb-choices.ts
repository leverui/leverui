import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type BreadcrumbSize = 'sm' | 'md' | 'lg';
export type BreadcrumbVariant = 'plain' | 'underline';
export type ResponsiveBreadcrumbChoice<T extends string> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

export interface BreadcrumbChoices {
  size: ResponsiveValues<BreadcrumbSize>;
  variant: ResponsiveValues<BreadcrumbVariant>;
}

const sizes = new Set<string>(['sm', 'md', 'lg']);
const variants = new Set<string>(['plain', 'underline']);

/** Validate one Breadcrumb choice at ordinary responsive breakpoints. */
function readChoice<T extends string>(
  value: ResponsiveBreadcrumbChoice<T> | undefined,
  allowed: ReadonlySet<string>,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const selected = readResponsiveStrings(value);
  if (!selected)
    throw new TypeError(`Breadcrumb ${label} uses an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice)) throw new TypeError(`Breadcrumb ${label} is unsupported: ${choice}.`);
    result[breakpoint] = choice as T;
  }
  return result;
}

/** Read finite Breadcrumb size and treatment selections. */
export function readBreadcrumbChoices(props: {
  size?: ResponsiveBreadcrumbChoice<BreadcrumbSize> | undefined;
  variant?: ResponsiveBreadcrumbChoice<BreadcrumbVariant> | undefined;
}): BreadcrumbChoices {
  return {
    size: readChoice(props.size, sizes, 'md', 'size'),
    variant: readChoice(props.variant, variants, 'plain', 'variant'),
  };
}

/** Accept a scalar palette name for public CSS palette selection. */
export function readBreadcrumbPalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Breadcrumb colorPalette must be a nonempty string.');
  }
  return value.trim();
}
