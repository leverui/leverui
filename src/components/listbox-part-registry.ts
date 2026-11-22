import { Listbox as PrimitiveListbox } from '../primitives/components/listbox';

/** Fix each public Listbox part to its primitive behavior and native element. */
export const listboxPartTags = {
  content: 'div',
  empty: 'div',
  input: 'input',
  item: 'div',
  itemGroup: 'div',
  itemGroupLabel: 'div',
  itemIndicator: 'div',
  itemText: 'span',
  label: 'span',
  list: 'div',
  status: 'div',
  valueText: 'span',
} as const;

export type ListboxPartSlot = keyof typeof listboxPartTags;

/** Keep machine-owned primitive parts in one slot registry. */
export const listboxPartComponents = {
  content: PrimitiveListbox.Content,
  empty: PrimitiveListbox.Empty,
  input: PrimitiveListbox.Input,
  item: PrimitiveListbox.Item,
  itemGroup: PrimitiveListbox.ItemGroup,
  itemGroupLabel: PrimitiveListbox.ItemGroupLabel,
  itemIndicator: PrimitiveListbox.ItemIndicator,
  itemText: PrimitiveListbox.ItemText,
  label: PrimitiveListbox.Label,
  list: PrimitiveListbox.List,
  status: PrimitiveListbox.Status,
  valueText: PrimitiveListbox.ValueText,
} as const;
