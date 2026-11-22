import { readQrCodeSizes, type QrCodeAppearance } from './qr-code-choices';

/** Reflect finite QR appearance on a native machine root. */
export function qrCodeAttributes(appearance: QrCodeAppearance): {
  'data-size': string | undefined;
  'data-size-sm': string | undefined;
  'data-size-md': string | undefined;
  'data-size-lg': string | undefined;
  'data-size-xl': string | undefined;
  'data-size-2xl': string | undefined;
  'data-unstyled': string | undefined;
} {
  const sizes = readQrCodeSizes(appearance.size);
  return {
    'data-size': sizes.base,
    'data-size-sm': sizes.sm,
    'data-size-md': sizes.md,
    'data-size-lg': sizes.lg,
    'data-size-xl': sizes.xl,
    'data-size-2xl': sizes['2xl'],
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
