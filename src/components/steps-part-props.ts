import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { stepsPartTags, StepsPartSlot } from './steps-part-registry';

type PartBehavior<Slot extends StepsPartSlot> = Slot extends 'item' | 'content'
  ? { value: string }
  : object;

export type StepsPartProps<
  Slot extends StepsPartSlot,
  As extends PrimitiveNativeTag = (typeof stepsPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof stepsPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean; className?: string },
  As
>;

export type StepsListProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<'list', As>;
export type StepsItemProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<'item', As>;
export type StepsTriggerProps<As extends PrimitiveNativeTag = 'button'> = StepsPartProps<
  'trigger',
  As
>;
export type StepsContentProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<
  'content',
  As
>;
export type StepsCompletedContentProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<
  'completedContent',
  As
>;
export type StepsTitleProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<'title', As>;
export type StepsDescriptionProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<
  'description',
  As
>;
export type StepsSeparatorProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<
  'separator',
  As
>;
export type StepsIndicatorProps<As extends PrimitiveNativeTag = 'div'> = StepsPartProps<
  'indicator',
  As
>;
export type StepsNextTriggerProps<As extends PrimitiveNativeTag = 'button'> = StepsPartProps<
  'nextTrigger',
  As
>;
export type StepsPrevTriggerProps<As extends PrimitiveNativeTag = 'button'> = StepsPartProps<
  'prevTrigger',
  As
>;
export type StepsNumberProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  NativeHtmlAliases & { className?: string; unstyled?: boolean },
  As
>;
