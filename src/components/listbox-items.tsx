import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { ListboxCheckIcon } from './listbox-icon';
import { renderListboxPart } from './listbox-part';
import type {
  ListboxItemGroupLabelProps,
  ListboxItemGroupProps,
  ListboxItemIndicatorProps,
  ListboxItemProps,
  ListboxItemTextProps,
} from './listbox-part-props';

/** Bind one collection item to the primitive's highlight and selection state. */
export function ListboxItem<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxItemProps<As>,
): JSX.Element {
  return renderListboxPart('item', props);
}

/** Group related options within the current collection. */
export function ListboxItemGroup<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxItemGroupProps<As>,
): JSX.Element {
  return renderListboxPart('itemGroup', props);
}

/** Label the nearest group without changing its item state. */
export function ListboxItemGroupLabel<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxItemGroupLabelProps<As>,
): JSX.Element {
  return renderListboxPart('itemGroupLabel', props);
}

/** Render the current collection item's visible text. */
export function ListboxItemText<As extends PrimitiveNativeTag = 'span'>(
  props: ListboxItemTextProps<As>,
): JSX.Element {
  return renderListboxPart('itemText', props);
}

/** Show the selected mark while preserving item context. */
export function ListboxItemIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxItemIndicatorProps<As>,
): JSX.Element {
  return renderListboxPart('itemIndicator', props, ListboxCheckIcon);
}
