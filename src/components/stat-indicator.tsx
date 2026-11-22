import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { StatArrow, type StatDirection } from './stat-arrow';
import { renderStatPart } from './stat-part';
import type {
  StatDownIndicatorProps,
  StatPartRuntimeProps,
  StatUpIndicatorProps,
} from './stat-props';

/** Render one trend indicator with its overridable default arrow. */
function renderStatIndicator(props: StatPartRuntimeProps, direction: StatDirection): JSX.Element {
  return renderStatPart(
    direction === 'up' ? 'StatUpIndicator' : 'StatDownIndicator',
    'span',
    'indicator',
    props,
    { 'data-type': direction },
    /** Draw an arrow only when the caller omits children. */
    () => <StatArrow direction={direction} />,
  );
}

/** Render an upward trend indicator. */
function StatUpIndicatorComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatIndicator(props, 'up');
}

/** Render a downward trend indicator. */
function StatDownIndicatorComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatIndicator(props, 'down');
}

/** Expose native upward indicator attributes and caller-owned child rendering. */
export const StatUpIndicator = StatUpIndicatorComponent as <As extends NativeElementTag = 'span'>(
  props: StatUpIndicatorProps<As>,
) => JSX.Element;

/** Expose native downward indicator attributes and caller-owned child rendering. */
export const StatDownIndicator = StatDownIndicatorComponent as <
  As extends NativeElementTag = 'span',
>(
  props: StatDownIndicatorProps<As>,
) => JSX.Element;
