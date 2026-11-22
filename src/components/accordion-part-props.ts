import type { AccordionItemProps as PrimitiveAccordionItemProps } from '../primitives/components/accordion';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { accordionPartTags, AccordionPartSlot } from './accordion-part-registry';

type PartBehavior<Slot extends AccordionPartSlot> = Slot extends 'item'
  ? Pick<PrimitiveAccordionItemProps, 'value' | 'disabled'>
  : object;

export type AccordionPartProps<
  Slot extends AccordionPartSlot,
  As extends PrimitiveNativeTag = (typeof accordionPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof accordionPartTags)[Slot],
  PartBehavior<Slot> & { unstyled?: boolean | undefined; className?: string | undefined },
  As
>;

export type AccordionItemProps<As extends PrimitiveNativeTag = 'div'> = AccordionPartProps<
  'item',
  As
>;
export type AccordionItemTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  AccordionPartProps<'itemTrigger', As>;
export type AccordionItemContentProps<As extends PrimitiveNativeTag = 'div'> = AccordionPartProps<
  'itemContent',
  As
>;
export type AccordionItemBodyProps<As extends PrimitiveNativeTag = 'div'> = AccordionPartProps<
  'itemBody',
  As
>;
export type AccordionItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = AccordionPartProps<
  'itemIndicator',
  As
>;
