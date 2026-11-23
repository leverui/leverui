import { type JSX } from '@solidjs/web';
import {
  readResponsiveCssValues,
  responsiveBreakpoints,
  type ResponsiveCssValue,
} from './responsive-values';

export interface LayoutVariable {
  name: string;
  value: ResponsiveCssValue | undefined;
}

/** Put each alias's effective value on its own element at every breakpoint. */
export function layoutVariableStyle(
  namespace: string,
  selections: readonly LayoutVariable[],
  consumerStyle: JSX.HTMLAttributes<HTMLElement>['style'],
  propagate = true,
): JSX.HTMLAttributes<HTMLElement>['style'] {
  const variables: Record<string, string> = {};
  for (const { name, value } of selections) {
    const values = readResponsiveCssValues(value);
    if (!values) throw new Error(`${namespace} ${name} requires supported breakpoint values.`);
    let current: string | number | undefined;
    for (const breakpoint of responsiveBreakpoints) {
      const value = values[breakpoint];
      if (value !== undefined) current = value;
      const selected = propagate ? current : value;
      if (selected !== undefined) {
        variables[`--lui-private-${namespace}-${name}-${breakpoint}`] = String(selected);
      }
    }
  }
  if (consumerStyle === undefined && Object.keys(variables).length === 0) return undefined;
  if (typeof consumerStyle === 'string') {
    const declarations = Object.entries(variables).map(
      /** Serialize the private variables after a native style string. */
      ([name, value]) => `${name}:${value}`,
    );
    return [consumerStyle, ...declarations].filter(Boolean).join(';');
  }
  return { ...variables, ...consumerStyle };
}
