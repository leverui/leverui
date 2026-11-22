export const checkmarkSizes = ['xs', 'sm', 'md', 'lg'] as const;
export type CheckmarkSize = (typeof checkmarkSizes)[number];
export const checkmarkVariants = ['solid', 'outline', 'subtle', 'plain', 'inverted'] as const;
export type CheckmarkVariant = (typeof checkmarkVariants)[number];

const sizeNames = new Set<string>(checkmarkSizes);
const variantNames = new Set<string>(checkmarkVariants);

/** Narrow a size to one with authored Checkmark CSS. */
export function isCheckmarkSize(value: string): value is CheckmarkSize {
  return sizeNames.has(value);
}

/** Narrow a treatment to one with authored Checkmark CSS. */
export function isCheckmarkVariant(value: string): value is CheckmarkVariant {
  return variantNames.has(value);
}
