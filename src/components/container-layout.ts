import { readResponsiveBooleans, responsiveBreakpoints } from '../styled-system/responsive-values';
import type { ContainerBaseProps } from './container-props';

export type ContainerVariants = Pick<ContainerBaseProps, 'centerContent' | 'fluid'>;

/** Keep a true variant active after later false choices. */
export function containerVariantAttributes(props: ContainerVariants): Record<string, string> {
  const centers = readResponsiveBooleans(props.centerContent);
  const fluids = readResponsiveBooleans(props.fluid);
  if (!centers || !fluids) throw new Error('Container variants require supported breakpoints.');
  const attributes: Record<string, string> = {};
  let center = false;
  let fluid = false;
  for (const breakpoint of responsiveBreakpoints) {
    center ||= centers[breakpoint] === true;
    fluid ||= fluids[breakpoint] === true;
    attributes[`data-center-content-${breakpoint}`] = String(center);
    attributes[`data-fluid-${breakpoint}`] = String(fluid);
  }
  return attributes;
}
