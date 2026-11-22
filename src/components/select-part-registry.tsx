import { Select as PrimitiveSelect } from '../primitives/components/select';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind each styled Select slot to its native element. */
export const selectPartTags = {
  clearTrigger: 'button',
  content: 'div',
  control: 'div',
  indicator: 'div',
  indicatorGroup: 'div',
  item: 'div',
  itemGroup: 'div',
  itemGroupLabel: 'div',
  itemIndicator: 'div',
  itemText: 'span',
  label: 'label',
  list: 'div',
  positioner: 'div',
  status: 'div',
  trigger: 'button',
  valueText: 'span',
} as const;

export type SelectPartSlot = keyof typeof selectPartTags;

/** Keep the primitive behavior bound to the corresponding visual slot. */
export const selectPartComponents = {
  clearTrigger: PrimitiveSelect.ClearTrigger,
  content: PrimitiveSelect.Content,
  control: PrimitiveSelect.Control,
  indicator: PrimitiveSelect.Indicator,
  indicatorGroup: primitiveNativeParts.div,
  item: PrimitiveSelect.Item,
  itemGroup: PrimitiveSelect.ItemGroup,
  itemGroupLabel: PrimitiveSelect.ItemGroupLabel,
  itemIndicator: PrimitiveSelect.ItemIndicator,
  itemText: PrimitiveSelect.ItemText,
  label: PrimitiveSelect.Label,
  list: PrimitiveSelect.List,
  positioner: PrimitiveSelect.Positioner,
  status: PrimitiveSelect.Status,
  trigger: PrimitiveSelect.Trigger,
  valueText: PrimitiveSelect.ValueText,
} as const;
