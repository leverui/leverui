import { layoutVariableStyle } from '../styled-system/layout-variables';
import {
  readResponsiveBooleans,
  readResponsiveStrings,
  responsiveBreakpoints,
  type ResponsiveValues,
} from '../styled-system/responsive-values';

type Responsive<T> = T | readonly (T | null | undefined)[] | ResponsiveValues<T>;
export type GroupOrientation = 'horizontal' | 'vertical';
export type GroupStacking = 'first-on-top' | 'last-on-top';

export interface GroupLayoutOptions {
  orientation?: Responsive<GroupOrientation> | undefined;
  attached?: Responsive<boolean> | undefined;
  grow?: Responsive<boolean> | undefined;
  stacking?: Responsive<GroupStacking> | undefined;
  align?: Responsive<string> | undefined;
  justify?: Responsive<string> | undefined;
  wrap?: Responsive<string> | undefined;
}

/** Read finite responsive choices without accepting arbitrary style conditions. */
function choiceValues<T extends string>(
  name: string,
  value: Responsive<T> | undefined,
  valid: readonly string[],
): ResponsiveValues<string> {
  const values = readResponsiveStrings(value);
  if (
    !values ||
    Object.values(values).some(
      /** Reject unsupported finite selections at the DOM boundary. */
      (choice) => !valid.includes(choice),
    )
  ) {
    throw new Error(`Group ${name} requires supported breakpoint values.`);
  }
  return values;
}

/** Read responsive boolean choices for joined edges and growth. */
function booleanValues(
  name: string,
  value: Responsive<boolean> | undefined,
): ResponsiveValues<boolean> {
  const values = readResponsiveBooleans(value);
  if (!values) throw new Error(`Group ${name} requires supported breakpoint values.`);
  return values;
}

/** Expose effective Group choices for authored breakpoint selectors. */
export function groupLayoutAttributes(
  props: GroupLayoutOptions,
): Record<string, string | undefined> {
  const orientations = choiceValues('orientation', props.orientation, ['horizontal', 'vertical']);
  const attached = booleanValues('attached', props.attached);
  const growth = booleanValues('grow', props.grow);
  const stacking = choiceValues('stacking', props.stacking, ['first-on-top', 'last-on-top']);
  const attributes: Record<string, string | undefined> = {};
  let direction = 'horizontal';
  let joined = false;
  let expanded = false;
  let order: string | undefined;
  for (const breakpoint of responsiveBreakpoints) {
    direction = orientations[breakpoint] ?? direction;
    joined = attached[breakpoint] ?? joined;
    expanded = growth[breakpoint] ?? expanded;
    order = stacking[breakpoint] ?? order;
    attributes[breakpoint === 'base' ? 'data-orientation' : `data-orientation-${breakpoint}`] =
      direction;
    attributes[`data-joined-${breakpoint}`] = joined ? direction : 'none';
    attributes[breakpoint === 'base' ? 'data-stacking' : `data-stacking-${breakpoint}`] = order;
    if (breakpoint === 'base') {
      attributes['data-attached'] = joined ? '' : undefined;
      attributes['data-grow'] = expanded ? '' : undefined;
    } else {
      attributes[`data-attached-${breakpoint}`] = String(joined);
      attributes[`data-grow-${breakpoint}`] = String(expanded);
    }
  }
  return attributes;
}

/** Put open alignment choices on the native Group element. */
export function groupLayoutStyle(
  props: GroupLayoutOptions,
  consumerStyle: Parameters<typeof layoutVariableStyle>[2],
): ReturnType<typeof layoutVariableStyle> {
  const selections = (['align', 'justify', 'wrap'] as const).map(
    /** Validate and name each native layout variable. */
    (name) => {
      const values = readResponsiveStrings(props[name]);
      if (!values) throw new Error(`Group ${name} requires supported breakpoint values.`);
      return { name, value: values };
    },
  );
  return layoutVariableStyle('group', selections, consumerStyle);
}
