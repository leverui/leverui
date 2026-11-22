import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderStatPart } from './stat-part';
import type { StatPartRuntimeProps, StatValueTextProps } from './stat-props';

/** Render the statistic's native description value. */
function StatValueTextComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatPart('StatValueText', 'dd', 'valueText', props);
}

/** Expose native value attributes and caller-owned child rendering. */
export const StatValueText = StatValueTextComponent as <As extends NativeElementTag = 'dd'>(
  props: StatValueTextProps<As>,
) => JSX.Element;
