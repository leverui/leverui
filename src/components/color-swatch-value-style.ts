import { type JSX } from '@solidjs/web';

type NativeStyle = JSX.HTMLAttributes<HTMLElement>['style'];

/** Bind the preview color as a private native variable below public CSS overrides. */
export function colorSwatchValueStyle(value: string, consumerStyle: NativeStyle): NativeStyle {
  if (/[;{}]/.test(value)) {
    throw new TypeError('ColorSwatch value must contain one CSS color.');
  }
  if (typeof consumerStyle === 'string') {
    return `${consumerStyle};--leverui-private-swatch-value:${value}`;
  }
  return { '--leverui-private-swatch-value': value, ...consumerStyle };
}
