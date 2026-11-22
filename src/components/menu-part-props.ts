import type {
  MenuCheckboxItemProps as PrimitiveCheckboxItemProps,
  MenuItemProps as PrimitiveItemProps,
  MenuRadioItemGroupProps as PrimitiveRadioItemGroupProps,
  MenuRadioItemProps as PrimitiveRadioItemProps,
} from '../primitives/components/menu';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { menuPartTags, MenuPartSlot } from './menu-part-registry';

type ItemBehavior = Pick<
  PrimitiveItemProps,
  'value' | 'valueText' | 'disabled' | 'closeOnSelect' | 'onSelect'
>;
type CheckboxBehavior = Pick<
  PrimitiveCheckboxItemProps,
  'value' | 'valueText' | 'disabled' | 'closeOnSelect' | 'checked' | 'onCheckedChange'
>;
type RadioBehavior = Pick<
  PrimitiveRadioItemProps,
  'value' | 'valueText' | 'disabled' | 'closeOnSelect'
>;
type RadioGroupBehavior = Pick<PrimitiveRadioItemGroupProps, 'value' | 'onValueChange' | 'id'>;

type PartBehavior<Slot extends MenuPartSlot> = Slot extends 'item'
  ? ItemBehavior
  : Slot extends 'checkboxItem'
    ? CheckboxBehavior
    : Slot extends 'radioItem'
      ? RadioBehavior
      : Slot extends 'radioItemGroup'
        ? RadioGroupBehavior
        : object;

export type MenuPartProps<
  Slot extends MenuPartSlot,
  As extends PrimitiveNativeTag = (typeof menuPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof menuPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type MenuTriggerProps<As extends PrimitiveNativeTag = 'button'> = MenuPartProps<
  'trigger',
  As
>;
export type MenuContextTriggerProps<As extends PrimitiveNativeTag = 'button'> = MenuPartProps<
  'contextTrigger',
  As
>;
export type MenuPositionerProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'positioner',
  As
>;
export type MenuContentProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<'content', As>;
export type MenuArrowProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<'arrow', As>;
export type MenuArrowTipProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'arrowTip',
  As
>;
export type MenuIndicatorProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'indicator',
  As
>;
export type MenuSeparatorProps<As extends PrimitiveNativeTag = 'hr'> = MenuPartProps<
  'separator',
  As
>;
export type MenuItemProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<'item', As>;
export type MenuTriggerItemProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'triggerItem',
  As
>;
export type MenuItemTextProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'itemText',
  As
>;
export type MenuItemCommandProps<As extends PrimitiveNativeTag = 'kbd'> = MenuPartProps<
  'itemCommand',
  As
>;
export type MenuItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'itemIndicator',
  As
>;
export type MenuItemGroupProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'itemGroup',
  As
>;
export type MenuItemGroupLabelProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'itemGroupLabel',
  As
>;
export type MenuCheckboxItemProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'checkboxItem',
  As
>;
export type MenuRadioItemGroupProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'radioItemGroup',
  As
>;
export type MenuRadioItemProps<As extends PrimitiveNativeTag = 'div'> = MenuPartProps<
  'radioItem',
  As
>;
