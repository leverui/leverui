import { type JSX } from '@solidjs/web';

export type BarListNativeStyle = JSX.HTMLAttributes<HTMLDivElement>['style'];

/** Merge open layout values with a consumer's native object or string style. */
export function barListNativeStyle(
  values: JSX.CSSProperties,
  consumer: BarListNativeStyle,
): BarListNativeStyle {
  if (typeof consumer !== 'string') return { ...values, ...consumer };
  const defaults = Object.entries(values)
    .filter(
      /** Omit absent layout values from native CSS text. */
      ([, value]) => value !== undefined,
    )
    .map(
      /** Serialize one caller-selected open value before their own style. */
      ([name, value]) => `${name}:${value}`,
    )
    .join(';');
  return `${defaults};${consumer}`;
}
