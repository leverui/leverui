import type {
  DateInputHiddenInputProps as PrimitiveHiddenInputProps,
  DateInputSegmentGroupProps as PrimitiveSegmentGroupProps,
  DateInputSegmentProps as PrimitiveSegmentProps,
} from '../primitives/components/date-input';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { dateInputPartTags, DateInputPartSlot } from './date-input-part-registry';

/** Keep segment and form settings on the public parts that own them. */
export type DateInputPartBehavior<Slot extends DateInputPartSlot> = Slot extends 'segment'
  ? Pick<PrimitiveSegmentProps, 'segment'>
  : Slot extends 'segmentGroup'
    ? Pick<PrimitiveSegmentGroupProps, 'index'>
    : Slot extends 'hiddenInput'
      ? Pick<PrimitiveHiddenInputProps, 'index' | 'name'>
      : object;

export type DateInputPartProps<
  Slot extends DateInputPartSlot,
  As extends PrimitiveNativeTag = (typeof dateInputPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof dateInputPartTags)[Slot],
  DateInputPartBehavior<Slot> & NativeHtmlAliases & { className?: string; unstyled?: boolean },
  As
>;

export type DateInputControlProps<As extends PrimitiveNativeTag = 'div'> = DateInputPartProps<
  'control',
  As
>;
export type DateInputHiddenInputProps<As extends PrimitiveNativeTag = 'input'> = DateInputPartProps<
  'hiddenInput',
  As
>;
export type DateInputLabelProps<As extends PrimitiveNativeTag = 'label'> = DateInputPartProps<
  'label',
  As
>;
export type DateInputSegmentProps<As extends PrimitiveNativeTag = 'span'> = DateInputPartProps<
  'segment',
  As
>;
export type DateInputSegmentGroupProps<As extends PrimitiveNativeTag = 'div'> = DateInputPartProps<
  'segmentGroup',
  As
>;
