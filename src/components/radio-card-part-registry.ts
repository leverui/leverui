import { RadioGroup as PrimitiveRadioGroup } from '../primitives/components/radio-group';
import { primitiveNativeParts } from './primitive-native-parts';

/** Fix every styled Radio Card part to its primitive behavior and native element. */
export const radioCardPartTags = {
  label: 'span',
  item: 'label',
  itemText: 'span',
  itemDescription: 'div',
  itemControl: 'div',
  itemContent: 'div',
  itemAddon: 'div',
  itemIndicator: 'span',
} as const;

export type RadioCardPartSlot = keyof typeof radioCardPartTags;

/** Keep machine-owned parts and plain layout parts in one registry. */
export const radioCardPartComponents = {
  label: PrimitiveRadioGroup.Label,
  item: PrimitiveRadioGroup.Item,
  itemText: PrimitiveRadioGroup.ItemText,
  itemDescription: primitiveNativeParts.div,
  itemControl: PrimitiveRadioGroup.ItemControl,
  itemContent: primitiveNativeParts.div,
  itemAddon: primitiveNativeParts.div,
  itemIndicator: primitiveNativeParts.span,
} as const;
