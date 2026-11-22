/** Identifies non-null, non-array object records. */
export const isObject = (v: unknown): v is Record<string, unknown> =>
  v != null && typeof v === 'object' && !Array.isArray(v);

/** Identifies a CSS custom-property reference. */
export const isCssVar = (v: string): boolean => /^var\(--.+\)$/.test(v);

/** Narrows an unknown value to a string. */
export const isString = (v: unknown): v is string => typeof v === 'string';
