import type { ResponsiveValues } from '../styled-system/responsive-values';
import {
  readFiniteResponsiveChoice,
  type FiniteResponsiveChoice,
} from './finite-responsive-choice';

export const qrCodeSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
export type QrCodeSize = (typeof qrCodeSizes)[number];

export interface QrCodeAppearance {
  size?: FiniteResponsiveChoice<QrCodeSize> | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

const sizes = new Set<string>(qrCodeSizes);

/** Keep QR sizing on the finite authored CSS selectors. */
export function readQrCodeSizes(value: unknown): ResponsiveValues<QrCodeSize> {
  return readFiniteResponsiveChoice(value, sizes, 'md', 'QR Code size');
}
