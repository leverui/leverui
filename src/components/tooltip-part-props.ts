import type { TooltipTriggerProps as PrimitiveTriggerProps } from '../primitives/components/tooltip';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { tooltipPartTags, TooltipPartSlot } from './tooltip-part-registry';

type PartBehavior<Slot extends TooltipPartSlot> = Slot extends 'trigger'
  ? Pick<PrimitiveTriggerProps, 'value'>
  : object;

export type TooltipPartProps<
  Slot extends TooltipPartSlot,
  As extends PrimitiveNativeTag = (typeof tooltipPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof tooltipPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type TooltipTriggerProps<As extends PrimitiveNativeTag = 'button'> = TooltipPartProps<
  'trigger',
  As
>;
export type TooltipPositionerProps<As extends PrimitiveNativeTag = 'div'> = TooltipPartProps<
  'positioner',
  As
>;
export type TooltipContentProps<As extends PrimitiveNativeTag = 'div'> = TooltipPartProps<
  'content',
  As
>;
export type TooltipArrowProps<As extends PrimitiveNativeTag = 'div'> = TooltipPartProps<
  'arrow',
  As
>;
export type TooltipArrowTipProps<As extends PrimitiveNativeTag = 'div'> = TooltipPartProps<
  'arrowTip',
  As
>;
