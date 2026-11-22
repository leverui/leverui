import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderStatPart } from './stat-part';
import type { StatPartRuntimeProps, StatValueUnitProps } from './stat-props';

/** Render a muted unit within the statistic value. */
function StatValueUnitComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatPart('StatValueUnit', 'span', 'valueUnit', props);
}

/** Expose native unit attributes and caller-owned child rendering. */
export const StatValueUnit = StatValueUnitComponent as <As extends NativeElementTag = 'span'>(
  props: StatValueUnitProps<As>,
) => JSX.Element;
