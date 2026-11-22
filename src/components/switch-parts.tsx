import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderSwitchPart, type SwitchRuntimePartProps } from './switch-part';
import type { SwitchControlProps, SwitchLabelProps, SwitchThumbProps } from './switch-part-props';

/** Expose the primitive's switch track with a default thumb when no children are supplied. */
function SwitchControlImpl(props: SwitchRuntimePartProps): JSX.Element {
  const withThumb = mergeProps(
    {
      /** Supply the default thumb only when the caller has no children prop. */
      get children() {
        return <SwitchThumb />;
      },
    },
    props,
  );
  return renderSwitchPart({ slot: 'control', props: withThumb });
}

/** Expose the precise native or polymorphic Switch control contract. */
export const SwitchControl = SwitchControlImpl as <As extends ComponentIntrinsicElement = 'span'>(
  props: SwitchControlProps<As>,
) => JSX.Element;

/** Render visible text within the native Switch label. */
export function SwitchLabel<As extends ComponentIntrinsicElement = 'span'>(
  props: SwitchLabelProps<As>,
): JSX.Element {
  return renderSwitchPart({ slot: 'label', props });
}

/** Render the moving thumb owned by the Switch machine. */
export function SwitchThumb<As extends ComponentIntrinsicElement = 'span'>(
  props: SwitchThumbProps<As>,
): JSX.Element {
  return renderSwitchPart({ slot: 'thumb', props });
}
