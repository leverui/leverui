import type { JSX } from '@solidjs/web';

/** A `class` value as Solid 2 accepts it: a string, a number, an array, or an object of toggles. */
export type ClassValue = JSX.ClassValue;

/** Flatten a Solid 2 class value into class tokens, keeping object keys whose value is truthy. */
export function classValueTokens(value: ClassValue): string[] {
  if (value == null || value === false || value === true) return [];
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  if (typeof value === 'number') return [String(value)];
  if (Array.isArray(value)) return value.flatMap(classValueTokens);
  return Object.keys(value).filter(
    /** Keep a toggle whose condition is truthy. */
    (name) => Boolean(value[name]),
  );
}

/** Flatten a Solid 2 class value into a class string. */
export function classValueString(value: ClassValue): string {
  return classValueTokens(value).join(' ');
}
