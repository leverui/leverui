import {
  readProgressCirclePalette,
  readProgressCircleSizes,
  type ProgressCircleAppearance,
} from './progress-circle-choices';

/** Reflect finite Circle appearance on the root for authored CSS. */
export function progressCircleAttributes(appearance: ProgressCircleAppearance): {
  'data-size': string | undefined;
  'data-size-sm': string | undefined;
  'data-size-md': string | undefined;
  'data-size-lg': string | undefined;
  'data-size-xl': string | undefined;
  'data-size-2xl': string | undefined;
  'data-lui-color-palette': string | undefined;
  'data-unstyled': string | undefined;
} {
  const sizes = readProgressCircleSizes(appearance.size);
  return {
    'data-size': sizes.base,
    'data-size-sm': sizes.sm,
    'data-size-md': sizes.md,
    'data-size-lg': sizes.lg,
    'data-size-xl': sizes.xl,
    'data-size-2xl': sizes['2xl'],
    'data-lui-color-palette': readProgressCirclePalette(appearance.colorPalette),
    'data-unstyled': appearance.unstyled ? '' : undefined,
  };
}
