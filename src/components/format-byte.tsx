import { FormatByte as PrimitiveFormatByte } from '../primitives/components/format';
import { type JSX } from '@solidjs/web';

export interface FormatByteProps {
  /** Unit used to interpret the value; defaults to bytes. */
  unit?: 'bit' | 'byte';
  /** How the localized unit label is displayed. */
  unitDisplay?: 'long' | 'short' | 'narrow';
  /** Base used to select the unit size. */
  unitSystem?: 'decimal' | 'binary';
  /** Amount in the selected unit; no bit/byte conversion is applied. */
  value: number;
}

/** Render a human-readable data size as text without adding a DOM element. */
export function FormatByte(props: FormatByteProps): JSX.Element {
  return <PrimitiveFormatByte {...props} />;
}
