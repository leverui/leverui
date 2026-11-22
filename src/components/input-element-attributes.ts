import {
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveCssValue,
} from '../styled-system/responsive-values';

export type InputElementPlacement = 'start' | 'end';
export type InputElementPlacementChoice = ResponsiveCssValue<InputElementPlacement>;

/** Validate finite placement values and carry each choice across breakpoints. */
export function inputElementPlacementAttributes(
  value: InputElementPlacementChoice | undefined,
): Record<string, string | undefined> {
  const selected = readResponsiveStrings(value);
  if (!selected) throw new TypeError('InputElement placement uses an unsupported breakpoint.');
  const attributes: Record<string, string | undefined> = {};
  let current: InputElementPlacement | undefined;
  for (const breakpoint of responsiveBreakpoints) {
    const choice = selected[breakpoint];
    if (choice !== undefined) {
      if (choice !== 'start' && choice !== 'end') {
        throw new TypeError(`InputElement placement is unsupported: ${choice}.`);
      }
      current = choice;
    }
    attributes[breakpoint === 'base' ? 'data-placement' : `data-placement-${breakpoint}`] = current;
  }
  return attributes;
}
