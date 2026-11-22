import { type JSX } from '@solidjs/web';
import { ComboboxCheckIcon } from './combobox-icons';
import { renderComboboxPart } from './combobox-part';
import type {
  ComboboxItemGroupLabelProps,
  ComboboxItemGroupProps,
  ComboboxItemIndicatorProps,
  ComboboxItemProps,
  ComboboxItemTextProps,
} from './combobox-part-props';
import type { ComponentIntrinsicElement } from './component-element-props';

/** Bind one collection item to the primitive's highlight and selection state. */
export function ComboboxItem<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxItemProps<As>,
): JSX.Element {
  return renderComboboxPart('item', props);
}

/** Group related options within the current collection. */
export function ComboboxItemGroup<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxItemGroupProps<As>,
): JSX.Element {
  return renderComboboxPart('itemGroup', props);
}

/** Label a grouped set of selectable options. */
export function ComboboxItemGroupLabel<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxItemGroupLabelProps<As>,
): JSX.Element {
  return renderComboboxPart('itemGroupLabel', props);
}

/** Render the current collection item's visible text. */
export function ComboboxItemText<As extends ComponentIntrinsicElement = 'span'>(
  props: ComboboxItemTextProps<As>,
): JSX.Element {
  return renderComboboxPart('itemText', props);
}

/** Show the selected mark while preserving item context. */
export function ComboboxItemIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: ComboboxItemIndicatorProps<As>,
): JSX.Element {
  return renderComboboxPart('itemIndicator', props, ComboboxCheckIcon);
}
