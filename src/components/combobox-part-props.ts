import type {
  ComboboxItemProps as PrimitiveItemProps,
  ComboboxTriggerProps as PrimitiveTriggerProps,
} from '../primitives/components/combobox';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { comboboxPartTags, ComboboxPartSlot } from './combobox-part-registry';

type PartBehavior<Slot extends ComboboxPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveItemProps, 'item' | 'persistFocus'>
  : Slot extends 'trigger'
    ? Pick<PrimitiveTriggerProps, 'focusable'>
    : object;

export type ComboboxPartProps<
  Slot extends ComboboxPartSlot,
  As extends PrimitiveNativeTag = (typeof comboboxPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof comboboxPartTags)[Slot],
  PartBehavior<Slot> &
    NativeHtmlAliases & {
      className?: string | undefined;
      unstyled?: boolean | undefined;
    },
  As
>;

export type ComboboxClearTriggerProps<As extends PrimitiveNativeTag = 'button'> = ComboboxPartProps<
  'clearTrigger',
  As
>;
export type ComboboxContentProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'content',
  As
>;
export type ComboboxControlProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'control',
  As
>;
export type ComboboxEmptyProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'empty',
  As
>;
export type ComboboxIndicatorGroupProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'indicatorGroup',
  As
>;
export type ComboboxInputProps<As extends PrimitiveNativeTag = 'input'> = ComboboxPartProps<
  'input',
  As
>;
export type ComboboxItemProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'item',
  As
>;
export type ComboboxItemGroupProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'itemGroup',
  As
>;
export type ComboboxItemGroupLabelProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'itemGroupLabel',
  As
>;
export type ComboboxItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'itemIndicator',
  As
>;
export type ComboboxItemTextProps<As extends PrimitiveNativeTag = 'span'> = ComboboxPartProps<
  'itemText',
  As
>;
export type ComboboxLabelProps<As extends PrimitiveNativeTag = 'label'> = ComboboxPartProps<
  'label',
  As
>;
export type ComboboxListProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'list',
  As
>;
export type ComboboxStatusProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'status',
  As
>;
export type ComboboxPositionerProps<As extends PrimitiveNativeTag = 'div'> = ComboboxPartProps<
  'positioner',
  As
>;
export type ComboboxTriggerProps<As extends PrimitiveNativeTag = 'button'> = ComboboxPartProps<
  'trigger',
  As
>;
