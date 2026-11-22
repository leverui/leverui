import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderStatPart } from './stat-part';
import type { StatLabelProps, StatPartRuntimeProps } from './stat-props';

/** Render the statistic's native description term. */
function StatLabelComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatPart('StatLabel', 'dt', 'label', props);
}

/** Expose native term attributes and caller-owned child rendering. */
export const StatLabel = StatLabelComponent as <As extends NativeElementTag = 'dt'>(
  props: StatLabelProps<As>,
) => JSX.Element;
