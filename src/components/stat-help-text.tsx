import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderStatPart } from './stat-part';
import type { StatHelpTextProps, StatPartRuntimeProps } from './stat-props';

/** Render supporting text beneath a statistic value. */
function StatHelpTextComponent(props: StatPartRuntimeProps): JSX.Element {
  return renderStatPart('StatHelpText', 'span', 'helpText', props);
}

/** Expose native help-text attributes and caller-owned child rendering. */
export const StatHelpText = StatHelpTextComponent as <As extends NativeElementTag = 'span'>(
  props: StatHelpTextProps<As>,
) => JSX.Element;
