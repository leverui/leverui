import type { SelectValueTextProps as PrimitiveValueTextProps } from '../primitives/components/select';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { CollectionItem } from './select-machine';
import type { selectPartTags, SelectPartSlot } from './select-part-registry';

type PartBehavior<Slot extends SelectPartSlot, T extends CollectionItem> = Slot extends 'item'
  ? { item: T; persistFocus?: boolean | undefined }
  : Slot extends 'valueText'
    ? Pick<PrimitiveValueTextProps, 'placeholder'>
    : object;

export type SelectPartProps<
  Slot extends SelectPartSlot,
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = (typeof selectPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof selectPartTags)[Slot],
  PartBehavior<Slot, T> &
    NativeHtmlAliases & {
      className?: string | undefined;
      unstyled?: boolean | undefined;
    },
  As
>;

export type SelectClearTriggerProps<As extends PrimitiveNativeTag = 'button'> = SelectPartProps<
  'clearTrigger',
  CollectionItem,
  As
>;
export type SelectContentProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'content',
  CollectionItem,
  As
>;
export type SelectControlProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'control',
  CollectionItem,
  As
>;
export type SelectIndicatorProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'indicator',
  CollectionItem,
  As
>;
export type SelectIndicatorGroupProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'indicatorGroup',
  CollectionItem,
  As
>;
export type SelectItemProps<
  T extends CollectionItem = CollectionItem,
  As extends PrimitiveNativeTag = 'div',
> = SelectPartProps<'item', T, As>;
export type SelectItemGroupProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'itemGroup',
  CollectionItem,
  As
>;
export type SelectItemGroupLabelProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'itemGroupLabel',
  CollectionItem,
  As
>;
export type SelectItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'itemIndicator',
  CollectionItem,
  As
>;
export type SelectItemTextProps<As extends PrimitiveNativeTag = 'span'> = SelectPartProps<
  'itemText',
  CollectionItem,
  As
>;
export type SelectLabelProps<As extends PrimitiveNativeTag = 'label'> = SelectPartProps<
  'label',
  CollectionItem,
  As
>;
export type SelectListProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'list',
  CollectionItem,
  As
>;
export type SelectStatusProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'status',
  CollectionItem,
  As
>;
export type SelectPositionerProps<As extends PrimitiveNativeTag = 'div'> = SelectPartProps<
  'positioner',
  CollectionItem,
  As
>;
export type SelectTriggerProps<As extends PrimitiveNativeTag = 'button'> = SelectPartProps<
  'trigger',
  CollectionItem,
  As
>;
export type SelectValueTextProps<As extends PrimitiveNativeTag = 'span'> = SelectPartProps<
  'valueText',
  CollectionItem,
  As
>;
