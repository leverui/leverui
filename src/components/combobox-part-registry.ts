import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import { primitiveNativeParts } from './primitive-native-parts';

/** Fix each public part to its primitive behavior and default native element. */
export const comboboxPartTags = {
  clearTrigger: 'button',
  content: 'div',
  control: 'div',
  empty: 'div',
  status: 'div',
  indicatorGroup: 'div',
  input: 'input',
  item: 'div',
  itemGroup: 'div',
  itemGroupLabel: 'div',
  itemIndicator: 'div',
  itemText: 'span',
  label: 'label',
  list: 'div',
  positioner: 'div',
  trigger: 'button',
} as const;

export type ComboboxPartSlot = keyof typeof comboboxPartTags;

/** Keep the native primitive part for each slot in one registry. */
export const comboboxPartComponents = {
  clearTrigger: PrimitiveCombobox.ClearTrigger,
  content: PrimitiveCombobox.Content,
  control: PrimitiveCombobox.Control,
  empty: PrimitiveCombobox.Empty,
  status: PrimitiveCombobox.Status,
  indicatorGroup: primitiveNativeParts.div,
  input: PrimitiveCombobox.Input,
  item: PrimitiveCombobox.Item,
  itemGroup: PrimitiveCombobox.ItemGroup,
  itemGroupLabel: PrimitiveCombobox.ItemGroupLabel,
  itemIndicator: PrimitiveCombobox.ItemIndicator,
  itemText: PrimitiveCombobox.ItemText,
  label: PrimitiveCombobox.Label,
  list: PrimitiveCombobox.List,
  positioner: PrimitiveCombobox.Positioner,
  trigger: PrimitiveCombobox.Trigger,
} as const;
