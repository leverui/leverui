import { Menu as PrimitiveMenu } from '../primitives/components/menu';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind public menu slots to their default native elements. */
export const menuPartTags = {
  trigger: 'button',
  contextTrigger: 'button',
  positioner: 'div',
  content: 'div',
  arrow: 'div',
  arrowTip: 'div',
  indicator: 'div',
  separator: 'hr',
  item: 'div',
  triggerItem: 'div',
  itemText: 'div',
  itemCommand: 'kbd',
  itemIndicator: 'div',
  itemGroup: 'div',
  itemGroupLabel: 'div',
  checkboxItem: 'div',
  radioItemGroup: 'div',
  radioItem: 'div',
} as const;

export type MenuPartSlot = keyof typeof menuPartTags;

/** Keep the primitive's behavior-owning parts at one rendering boundary. */
export const menuPartComponents = {
  trigger: PrimitiveMenu.Trigger,
  contextTrigger: PrimitiveMenu.ContextTrigger,
  positioner: PrimitiveMenu.Positioner,
  content: PrimitiveMenu.Content,
  arrow: PrimitiveMenu.Arrow,
  arrowTip: PrimitiveMenu.ArrowTip,
  indicator: PrimitiveMenu.Indicator,
  separator: PrimitiveMenu.Separator,
  item: PrimitiveMenu.Item,
  triggerItem: PrimitiveMenu.TriggerItem,
  itemText: PrimitiveMenu.ItemText,
  itemCommand: primitiveNativeParts.kbd,
  itemIndicator: PrimitiveMenu.ItemIndicator,
  itemGroup: PrimitiveMenu.ItemGroup,
  itemGroupLabel: PrimitiveMenu.ItemGroupLabel,
  checkboxItem: PrimitiveMenu.CheckboxItem,
  radioItemGroup: PrimitiveMenu.RadioItemGroup,
  radioItem: PrimitiveMenu.RadioItem,
} as const;

/** Map behavior-sharing parts to the same authored CSS rules. */
export const menuStyleSlots = {
  trigger: 'trigger',
  contextTrigger: 'contextTrigger',
  positioner: 'positioner',
  content: 'content',
  arrow: 'arrow',
  arrowTip: 'arrowTip',
  indicator: 'indicator',
  separator: 'separator',
  item: 'item',
  itemText: 'itemText',
  itemCommand: 'itemCommand',
  itemIndicator: 'itemIndicator',
  itemGroup: 'itemGroup',
  itemGroupLabel: 'itemGroupLabel',
  checkboxItem: 'item',
  radioItem: 'item',
  radioItemGroup: 'itemGroup',
  triggerItem: 'item',
} as const satisfies Record<MenuPartSlot, string>;
