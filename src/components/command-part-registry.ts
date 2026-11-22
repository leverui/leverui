import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import { primitiveNativeParts } from './primitive-native-parts';
import { CommandListPart } from './command-list-part';

/** Select the primitive behavior or a native element for every Command slot. */
export const commandPartComponents = {
  label: PrimitiveCombobox.Label,
  control: PrimitiveCombobox.Control,
  indicator: primitiveNativeParts.div,
  input: PrimitiveCombobox.Input,
  clearTrigger: PrimitiveCombobox.ClearTrigger,
  list: CommandListPart,
  item: PrimitiveCombobox.Item,
  itemText: PrimitiveCombobox.ItemText,
  itemCommand: primitiveNativeParts.kbd,
  itemGroup: PrimitiveCombobox.ItemGroup,
  itemGroupLabel: PrimitiveCombobox.ItemGroupLabel,
  // Lever mounts Command's empty message itself, inside the list, only when empty.
  empty: primitiveNativeParts.div,
  loading: primitiveNativeParts.div,
  separator: primitiveNativeParts.div,
  footer: primitiveNativeParts.div,
} as const;

export type CommandPartSlot = keyof typeof commandPartComponents;

/** Preserve the expected native element for polymorphic part rendering. */
export const commandPartTags = {
  label: 'label',
  control: 'div',
  indicator: 'div',
  input: 'input',
  clearTrigger: 'button',
  list: 'div',
  item: 'div',
  itemText: 'span',
  itemCommand: 'kbd',
  itemGroup: 'div',
  itemGroupLabel: 'div',
  empty: 'div',
  loading: 'div',
  separator: 'div',
  footer: 'div',
} as const;
