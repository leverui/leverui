export const textareaSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const textareaVariants = ['outline', 'subtle', 'flushed'] as const;

export type TextareaSize = (typeof textareaSizes)[number];
export type TextareaVariant = (typeof textareaVariants)[number];

/** Recognize only Textarea sizes backed by authored CSS. */
export function isTextareaSize(value: string): value is TextareaSize {
  return textareaSizes.some(
    /** Compare a candidate with one finite size. */
    (size) => size === value,
  );
}

/** Recognize only Textarea treatments backed by authored CSS. */
export function isTextareaVariant(value: string): value is TextareaVariant {
  return textareaVariants.some(
    /** Compare a candidate with one finite treatment. */
    (variant) => variant === value,
  );
}
