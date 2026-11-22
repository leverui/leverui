import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type DataListSize = 'sm' | 'md' | 'lg';
export type DataListOrientation = 'vertical' | 'horizontal';
export type DataListVariant = 'subtle' | 'bold';
export type ResponsiveDataListChoice<T extends string> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

export interface DataListChoices {
  size: ResponsiveValues<DataListSize>;
  orientation: ResponsiveValues<DataListOrientation>;
  variant: ResponsiveValues<DataListVariant>;
}

const sizes = new Set<string>(['sm', 'md', 'lg']);
const orientations = new Set<string>(['vertical', 'horizontal']);
const variants = new Set<string>(['subtle', 'bold']);

/** Validate one finite choice at ordinary responsive breakpoints. */
function readChoice<T extends string>(
  value: ResponsiveDataListChoice<T> | undefined,
  allowed: ReadonlySet<string>,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError(`Data List ${label} uses an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice)) throw new TypeError(`Data List ${label} is unsupported: ${choice}.`);
    result[breakpoint] = choice as T;
  }
  return result;
}

/** Read Data List's finite size, flow, and emphasis selections. */
export function readDataListChoices(props: {
  size?: ResponsiveDataListChoice<DataListSize> | undefined;
  orientation?: ResponsiveDataListChoice<DataListOrientation> | undefined;
  variant?: ResponsiveDataListChoice<DataListVariant> | undefined;
}): DataListChoices {
  return {
    size: readChoice(props.size, sizes, 'md', 'size'),
    orientation: readChoice(props.orientation, orientations, 'vertical', 'orientation'),
    variant: readChoice(props.variant, variants, 'subtle', 'variant'),
  };
}
