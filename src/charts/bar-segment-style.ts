import { type JSX } from '@solidjs/web';

export type BarSegmentNativeStyle = JSX.HTMLAttributes<HTMLDivElement>['style'];

/** Merge data-driven CSS variables with a consumer's native style. */
export function barSegmentNativeStyle(
  variables: JSX.CSSProperties,
  consumer: BarSegmentNativeStyle,
): BarSegmentNativeStyle {
  if (typeof consumer !== 'string') return { ...variables, ...consumer };
  const defaults = Object.entries(variables)
    .filter(
      /** Skip absent selections when serializing a string style. */
      ([, value]) => value !== undefined,
    )
    .map(
      /** Keep the caller's declarations last in the cascade. */
      ([name, value]) => `${name}:${value}`,
    )
    .join(';');
  return `${defaults};${consumer}`;
}
