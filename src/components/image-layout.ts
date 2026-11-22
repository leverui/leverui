import { layoutVariableStyle } from '../styled-system/layout-variables';
import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

type ResponsiveString<T extends string> =
  T | readonly (T | null | undefined)[] | ResponsiveValues<T>;
type Fit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export type ImageFit = ResponsiveString<Fit>;
export type ImagePosition = ResponsiveString<string>;

/** Keep invalid object-fit strings out of the public Image contract. */
function isImageFit(value: string): value is Fit {
  return (
    value === 'cover' ||
    value === 'contain' ||
    value === 'fill' ||
    value === 'none' ||
    value === 'scale-down'
  );
}

/** Expose finite fit selections for authored breakpoint rules. */
export function imageFitAttributes(fit: ImageFit | undefined): Record<string, Fit> {
  const values = readResponsiveStrings(fit);
  if (!values) throw new Error('Image fit requires supported breakpoint values.');
  const attributes: Record<string, Fit> = {};
  for (const breakpoint of responsiveBreakpoints) {
    const selected = values[breakpoint];
    if (selected === undefined) continue;
    if (!isImageFit(selected)) throw new Error(`Unsupported Image fit: ${selected}.`);
    attributes[`data-fit-${breakpoint}`] = selected;
  }
  return attributes;
}

/** Carry an open object-position value through native element variables. */
export function imagePositionStyle(
  align: ImagePosition | undefined,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  const values = readResponsiveStrings(align);
  if (!values) throw new Error('Image align requires supported breakpoint values.');
  return layoutVariableStyle('image', [{ name: 'align', value: values }], consumerStyle);
}
