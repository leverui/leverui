import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useRadioCardItemContext } from './radio-card-machine';
import { renderRadioCardPart } from './radio-card-part';
import type {
  RadioCardItemAddonProps,
  RadioCardItemContentProps,
  RadioCardItemControlProps,
  RadioCardItemDescriptionProps,
  RadioCardItemProps,
  RadioCardItemTextProps,
  RadioCardLabelProps,
} from './radio-card-part-props';

/** Label the current Radio Card group. */
export function RadioCardLabel<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioCardLabelProps<As>,
): JSX.Element {
  return renderRadioCardPart({ slot: 'label', props });
}

/** Bind a card to one radio value and its item state. */
export function RadioCardItem<As extends ComponentIntrinsicElement = 'label'>(
  props: RadioCardItemProps<As>,
): JSX.Element {
  return renderRadioCardPart({ slot: 'item', props });
}

/** Render the visible text for the nearest card. */
export function RadioCardItemText<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioCardItemTextProps<As>,
): JSX.Element {
  return renderRadioCardPart({ slot: 'itemText', props });
}

/** Describe the nearest card without adding a selection target. */
export function RadioCardItemDescription<As extends ComponentIntrinsicElement = 'div'>(
  props: RadioCardItemDescriptionProps<As>,
): JSX.Element {
  return renderRadioCardPart({ slot: 'itemDescription', props });
}

/** Expose the primitive's focus and selection state on the card control. */
export function RadioCardItemControl<As extends ComponentIntrinsicElement = 'div'>(
  props: RadioCardItemControlProps<As>,
): JSX.Element {
  const native = mergeProps({ 'aria-hidden': 'false' }, props);
  return renderRadioCardPart({ slot: 'itemControl', props: native });
}

/** Arrange a card's title, description, and supporting content. */
export function RadioCardItemContent<As extends ComponentIntrinsicElement = 'div'>(
  props: RadioCardItemContentProps<As>,
): JSX.Element {
  return renderRadioCardPart({ slot: 'itemContent', props });
}

/** Attach supporting content beneath a card control. */
export function RadioCardItemAddon<As extends ComponentIntrinsicElement = 'div'>(
  props: RadioCardItemAddonProps<As>,
): JSX.Element {
  const item = useRadioCardItemContext();
  const native = mergeProps(props, {
    /** Mirror the native disabled state for the supporting addon. */
    get 'data-disabled'() {
      return item().disabled ? '' : undefined;
    },
  });
  return renderRadioCardPart({ slot: 'itemAddon', props: native });
}

export { RadioCardItemIndicator } from './radio-card-indicator';
