import { classValueTokens, type ClassValue } from './class-value';

/**
 * Joins nonempty class names. Accepts Solid 2 class values: strings, arrays,
 * and objects whose truthy keys are kept. Other inputs are ignored.
 */
export const cx = (...classNames: unknown[]): string => {
  const classes: string[] = [];
  for (const className of classNames) {
    if (!isClassValue(className)) continue;
    classes.push(...classValueTokens(className));
  }
  return classes.join(' ');
};

/** Recognize a value Solid 2 accepts as a class. */
function isClassValue(value: unknown): value is ClassValue {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value) ||
    (typeof value === 'object' && value !== null)
  );
}
