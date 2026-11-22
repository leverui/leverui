import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

/** Keep authored treatments and the example matrix in one ordered list. */
export const blockquoteVariants = ['subtle', 'solid', 'plain'] as const;
const justifications = ['start', 'center', 'end'] as const;
export type BlockquoteVariant = (typeof blockquoteVariants)[number];
export type BlockquoteJustify = (typeof justifications)[number];

/** Narrow a string to one of a family's authored CSS choices. */
function isChoice<T extends string>(value: string, allowed: readonly T[]): value is T {
  for (const option of allowed) {
    if (option === value) return true;
  }
  return false;
}

/** Validate finite choices at ordinary breakpoints with a default base. */
function readChoice<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
  label: string,
): ResponsiveValues<T> {
  const selected = readResponsiveStrings(value);
  if (!selected)
    throw new TypeError(`Blockquote ${label} uses an unsupported breakpoint or value.`);
  const result: ResponsiveValues<T> = { base: fallback };
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice === undefined) continue;
    if (!isChoice(choice, allowed))
      throw new TypeError(`Blockquote ${label} is unsupported: ${choice}.`);
    result[breakpoint] = choice;
  }
  return result;
}

/** Select the border and icon treatment at supported breakpoints. */
export function readBlockquoteVariants(value: unknown): ResponsiveValues<BlockquoteVariant> {
  return readChoice(value, blockquoteVariants, 'subtle', 'variant');
}

/** Select quote alignment at supported breakpoints. */
export function readBlockquoteJustify(value: unknown): ResponsiveValues<BlockquoteJustify> {
  return readChoice(value, justifications, 'start', 'justify');
}

/** Keep only a nonempty scalar palette in the public CSS attribute. */
export function readBlockquotePalette(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Blockquote colorPalette must be a nonempty string.');
  }
  return value.trim();
}
