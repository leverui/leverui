import { Accordion as PrimitiveAccordion } from '../primitives/components/accordion';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind each styled Accordion slot to its native element. */
export const accordionPartTags = {
  item: 'div',
  itemTrigger: 'button',
  itemContent: 'div',
  itemBody: 'div',
  itemIndicator: 'div',
} as const;

export type AccordionPartSlot = keyof typeof accordionPartTags;

/** Keep the primitive's machine-owned parts beside the native body element. */
export const accordionPartComponents = {
  item: PrimitiveAccordion.Item,
  itemTrigger: PrimitiveAccordion.ItemTrigger,
  itemContent: PrimitiveAccordion.ItemContent,
  itemBody: primitiveNativeParts.div,
  itemIndicator: PrimitiveAccordion.ItemIndicator,
} as const;
