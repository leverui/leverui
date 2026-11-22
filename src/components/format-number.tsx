import { FormatNumber as PrimitiveFormatNumber } from '../primitives/components/format';
import { type JSX } from '@solidjs/web';

export interface FormatNumberProps extends Intl.NumberFormatOptions {
  /** Number to format with the nearest locale and the supplied Intl options. */
  value: number;
}

/** Render a locale-aware number as text without adding a DOM element. */
export function FormatNumber(props: FormatNumberProps): JSX.Element {
  return <PrimitiveFormatNumber {...props} />;
}
