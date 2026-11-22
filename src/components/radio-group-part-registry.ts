import { RadioGroup as PrimitiveRadioGroup } from '../primitives/components/radio-group';
/** Fix every styled Radio Group part to its primitive behavior and native element. */
export const radioGroupPartTags = {
  label: 'span',
  item: 'label',
  itemText: 'span',
  itemControl: 'div',
} as const;

export type RadioGroupPartSlot = keyof typeof radioGroupPartTags;

/** Keep machine-owned parts in one registry. */
export const radioGroupPartComponents = {
  label: PrimitiveRadioGroup.Label,
  item: PrimitiveRadioGroup.Item,
  itemText: PrimitiveRadioGroup.ItemText,
  itemControl: PrimitiveRadioGroup.ItemControl,
} as const;
