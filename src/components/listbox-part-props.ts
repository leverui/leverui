import type {
  ListboxInputProps as PrimitiveInputProps,
  ListboxItemProps as PrimitiveItemProps,
  ListboxValueTextProps as PrimitiveValueTextProps,
} from '../primitives/components/listbox';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { listboxPartTags, ListboxPartSlot } from './listbox-part-registry';

type PartBehavior<Slot extends ListboxPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveItemProps, 'item' | 'highlightOnHover'>
  : Slot extends 'input'
    ? Pick<PrimitiveInputProps, 'autoHighlight' | 'keyboardPriority'>
    : Slot extends 'valueText'
      ? Pick<PrimitiveValueTextProps, 'placeholder'>
      : object;

export type ListboxPartProps<
  Slot extends ListboxPartSlot,
  As extends PrimitiveNativeTag = (typeof listboxPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof listboxPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { className?: string; unstyled?: boolean },
  As
>;

export type ListboxContentProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'content',
  As
>;
export type ListboxEmptyProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'empty',
  As
>;
export type ListboxListProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<'list', As>;
export type ListboxStatusProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'status',
  As
>;
export type ListboxInputProps<As extends PrimitiveNativeTag = 'input'> = ListboxPartProps<
  'input',
  As
>;
export type ListboxItemProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<'item', As>;
export type ListboxItemGroupProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'itemGroup',
  As
>;
export type ListboxItemGroupLabelProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'itemGroupLabel',
  As
>;
export type ListboxItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = ListboxPartProps<
  'itemIndicator',
  As
>;
export type ListboxItemTextProps<As extends PrimitiveNativeTag = 'span'> = ListboxPartProps<
  'itemText',
  As
>;
export type ListboxLabelProps<As extends PrimitiveNativeTag = 'span'> = ListboxPartProps<
  'label',
  As
>;
export type ListboxValueTextProps<As extends PrimitiveNativeTag = 'span'> = ListboxPartProps<
  'valueText',
  As
>;
