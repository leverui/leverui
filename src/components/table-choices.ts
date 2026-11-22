import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';
import type {
  ResponsiveTableChoice,
  TableRootBaseProps,
  TableSize,
  TableVariant,
} from './table-props';

export interface TableChoices {
  size: ResponsiveValues<TableSize>;
  variant: ResponsiveValues<TableVariant>;
}

/** Recognize only Table sizes backed by authored CSS. */
function isTableSize(value: string): value is TableSize {
  return value === 'sm' || value === 'md' || value === 'lg';
}

/** Recognize only authored Table treatments. */
function isTableVariant(value: string): value is TableVariant {
  return value === 'line' || value === 'outline';
}

/** Read one finite choice at supported responsive breakpoints. */
function readChoice<T extends string>(
  value: ResponsiveTableChoice<T> | undefined,
  isAllowed: (candidate: string) => candidate is T,
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const choices = readResponsiveStrings(value);
  if (!choices) throw new TypeError(`Table ${label} uses an unsupported breakpoint or value.`);
  const selected: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = choices[breakpoint];
    if (choice === undefined) continue;
    if (!isAllowed(choice)) throw new TypeError(`Table ${label} is unsupported: ${choice}.`);
    selected[breakpoint] = choice;
  }
  return selected;
}

/** Validate Table size and treatment before reflecting them in DOM attributes. */
export function readTableChoices(props: TableRootBaseProps): TableChoices {
  return {
    size: readChoice(props.size, isTableSize, 'md', 'size'),
    variant: readChoice(props.variant, isTableVariant, 'line', 'variant'),
  };
}

/** Accept a nonempty palette name for Table row colors. */
export function readTablePalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Table colorPalette must be a nonempty string.');
  }
  return value.trim();
}
