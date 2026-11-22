import type { HoverCardTriggerProps as PrimitiveTriggerProps } from '../primitives/components/hover-card';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { hoverCardPartTags, HoverCardPartSlot } from './hover-card-part-registry';

type PartBehavior<Slot extends HoverCardPartSlot> = Slot extends 'trigger'
  ? Pick<PrimitiveTriggerProps, 'value'>
  : object;

export type HoverCardPartProps<
  Slot extends HoverCardPartSlot,
  As extends PrimitiveNativeTag = (typeof hoverCardPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof hoverCardPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type HoverCardTriggerProps<As extends PrimitiveNativeTag = 'button'> = HoverCardPartProps<
  'trigger',
  As
>;
export type HoverCardPositionerProps<As extends PrimitiveNativeTag = 'div'> = HoverCardPartProps<
  'positioner',
  As
>;
export type HoverCardContentProps<As extends PrimitiveNativeTag = 'div'> = HoverCardPartProps<
  'content',
  As
>;
export type HoverCardArrowProps<As extends PrimitiveNativeTag = 'div'> = HoverCardPartProps<
  'arrow',
  As
>;
export type HoverCardArrowTipProps<As extends PrimitiveNativeTag = 'div'> = HoverCardPartProps<
  'arrowTip',
  As
>;
