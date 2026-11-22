import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

export type SeparatorSize = 'xs' | 'sm' | 'md' | 'lg';
export type SeparatorVariant = 'solid' | 'dashed' | 'dotted';
export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorChoice<T extends string> =
  T | readonly (T | null | undefined)[] | ResponsiveValues<T>;

export interface SeparatorChoices {
  size: ResponsiveValues<SeparatorSize>;
  variant: ResponsiveValues<SeparatorVariant>;
  orientation: ResponsiveValues<SeparatorOrientation>;
}

const sizes = new Set<string>(['xs', 'sm', 'md', 'lg']);
const variants = new Set<string>(['solid', 'dashed', 'dotted']);
const orientations = new Set<string>(['horizontal', 'vertical']);

/** Validate one finite separator choice at ordinary breakpoints. */
function readChoice<T extends string>(
  value: SeparatorChoice<T> | undefined,
  allowed: ReadonlySet<string>,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const parsed = readResponsiveStrings(value);
  if (!parsed) throw new TypeError(`Separator ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = parsed[breakpoint];
    if (choice === undefined) continue;
    if (!allowed.has(choice)) throw new TypeError(`Separator ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice as T;
  }
  return selected;
}

/** Resolve line thickness, border treatment, and visual orientation. */
export function readSeparatorChoices(props: {
  size?: SeparatorChoice<SeparatorSize> | undefined;
  variant?: SeparatorChoice<SeparatorVariant> | undefined;
  orientation?: SeparatorChoice<SeparatorOrientation> | undefined;
}): SeparatorChoices {
  return {
    size: readChoice(props.size, sizes, 'sm', 'size'),
    variant: readChoice(props.variant, variants, 'solid', 'variant'),
    orientation: readChoice(props.orientation, orientations, 'horizontal', 'orientation'),
  };
}
