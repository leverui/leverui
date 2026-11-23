import { Show } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useRadioGroupItemContext } from './radio-group-machine';
import { renderRadioGroupPart } from './radio-group-part';
import type {
  RadioGroupItemControlProps,
  RadioGroupItemIndicatorProps,
  RadioGroupItemProps,
  RadioGroupItemTextProps,
  RadioGroupLabelProps,
} from './radio-group-part-props';

/** Label the current radio group. */
export function RadioGroupLabel<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioGroupLabelProps<As>,
): JSX.Element {
  return renderRadioGroupPart({ slot: 'label', props });
}

/** Bind an item to one radio value and its machine state. */
export function RadioGroupItem<As extends ComponentIntrinsicElement = 'label'>(
  props: RadioGroupItemProps<As>,
): JSX.Element {
  return renderRadioGroupPart({ slot: 'item', props });
}

/** Render visible text for the nearest radio item. */
export function RadioGroupItemText<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioGroupItemTextProps<As>,
): JSX.Element {
  return renderRadioGroupPart({ slot: 'itemText', props });
}

/** Expose the primitive selection and focus state on a native control element. */
export function RadioGroupItemControl<As extends ComponentIntrinsicElement = 'div'>(
  props: RadioGroupItemControlProps<As>,
): JSX.Element {
  const item = useRadioGroupItemContext();
  const native = mergeProps(props, {
    /** Mirror checked state for shared Radiomark CSS. */
    get 'data-checked'() {
      return item().checked ? '' : undefined;
    },
    /** Mirror disabled state for the visual mark. */
    get 'data-disabled'() {
      return item().disabled ? '' : undefined;
    },
  });
  return renderRadioGroupPart({ slot: 'itemControl', props: native });
}

/** Render an authored CSS radio mark using the nearest item's state. */
export function RadioGroupItemIndicator<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioGroupItemIndicatorProps<As>,
): JSX.Element {
  const item = useRadioGroupItemContext();
  const indicatorProps = mergeProps({ as: 'span' as const }, props, {
    /** Expose the Indicator's own public hook beside the shared control. */
    get class() {
      return composeRecipeClassNames(
        'radio-group__itemIndicator',
        undefined,
        props.class,
        props.className,
      );
    },
    /** Mirror the state that styles the shared Radiomark CSS. */
    get 'data-checked'() {
      return item().checked ? '' : undefined;
    },
    /** Mark disabled items for the native Radiomark selector. */
    get 'data-disabled'() {
      return item().disabled ? '' : undefined;
    },
    /** Render the dot only while the radio is selected. */
    get children() {
      return (
        <Show when={item().checked}>
          <span class="dot lui-radiomark__dot" />
        </Show>
      );
    },
  });
  return renderRadioGroupPart({ slot: 'itemControl', props: indicatorProps });
}
