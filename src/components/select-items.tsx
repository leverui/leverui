import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { SelectCheckIcon } from './select-icons';
import type { CollectionItem } from './select-machine';
import { renderSelectPart } from './select-part';
import type {
  SelectItemGroupLabelProps,
  SelectItemGroupProps,
  SelectItemIndicatorProps,
  SelectItemProps,
  SelectItemTextProps,
} from './select-part-props';

/** Bind one collection item to the primitive's highlight and selection state. */
export function SelectItem<T extends CollectionItem, As extends ComponentIntrinsicElement = 'div'>(
  props: SelectItemProps<T, As>,
): JSX.Element {
  return renderSelectPart('item', props);
}

/** Group related options in the current Select collection. */
export function SelectItemGroup<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectItemGroupProps<As>,
): JSX.Element {
  return renderSelectPart('itemGroup', props);
}

/** Label a grouped set of Select options. */
export function SelectItemGroupLabel<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectItemGroupLabelProps<As>,
): JSX.Element {
  return renderSelectPart('itemGroupLabel', props);
}

/** Render the nearest collection item's visible text. */
export function SelectItemText<As extends ComponentIntrinsicElement = 'span'>(
  props: SelectItemTextProps<As>,
): JSX.Element {
  return renderSelectPart('itemText', props);
}

/** Show the selected mark while preserving item context. */
export function SelectItemIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectItemIndicatorProps<As>,
): JSX.Element {
  return renderSelectPart('itemIndicator', props, SelectCheckIcon);
}
