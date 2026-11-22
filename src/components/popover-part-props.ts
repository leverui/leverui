import type { PopoverTriggerProps as PrimitiveTriggerProps } from '../primitives/components/popover';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { popoverPartTags, PopoverPartSlot } from './popover-part-registry';

type PartBehavior<Slot extends PopoverPartSlot> = Slot extends 'trigger'
  ? Pick<PrimitiveTriggerProps, 'value'>
  : object;

export type PopoverPartProps<
  Slot extends PopoverPartSlot,
  As extends PrimitiveNativeTag = (typeof popoverPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof popoverPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type PopoverAnchorProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'anchor',
  As
>;
export type PopoverTriggerProps<As extends PrimitiveNativeTag = 'button'> = PopoverPartProps<
  'trigger',
  As
>;
export type PopoverPositionerProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'positioner',
  As
>;
export type PopoverContentProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'content',
  As
>;
export type PopoverArrowProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'arrow',
  As
>;
export type PopoverArrowTipProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'arrowTip',
  As
>;
export type PopoverCloseTriggerProps<As extends PrimitiveNativeTag = 'button'> = PopoverPartProps<
  'closeTrigger',
  As
>;
export type PopoverTitleProps<As extends PrimitiveNativeTag = 'h2'> = PopoverPartProps<'title', As>;
export type PopoverDescriptionProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<
  'description',
  As
>;
export type PopoverHeaderProps<As extends PrimitiveNativeTag = 'header'> = PopoverPartProps<
  'header',
  As
>;
export type PopoverBodyProps<As extends PrimitiveNativeTag = 'div'> = PopoverPartProps<'body', As>;
export type PopoverFooterProps<As extends PrimitiveNativeTag = 'footer'> = PopoverPartProps<
  'footer',
  As
>;
