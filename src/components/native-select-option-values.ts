import type { NativeSelectFieldProps } from './native-select-props';

export type NativeSelectValue = NonNullable<NativeSelectFieldProps['defaultValue']>;

/** Normalize single and multiple native selection values for option matching. */
export function nativeSelectValues(value: NativeSelectValue): ReadonlySet<string> {
  const values = new Set<string>();
  if (typeof value === 'string' || typeof value === 'number') {
    values.add(String(value));
  } else {
    for (const item of value) values.add(item);
  }
  return values;
}
