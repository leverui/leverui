import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { AccordionChevronIcon } from './accordion-icons';
import { renderAccordionPart } from './accordion-part';
import type {
  AccordionItemBodyProps,
  AccordionItemContentProps,
  AccordionItemIndicatorProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
} from './accordion-part-props';

/** Bind one disclosure item to its stable machine value. */
export function AccordionItem<As extends PrimitiveNativeTag = 'div'>(
  props: AccordionItemProps<As>,
): JSX.Element {
  return renderAccordionPart({ slot: 'item', props });
}

/** Render an accessible button that toggles its item. */
export function AccordionItemTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: AccordionItemTriggerProps<As>,
): JSX.Element {
  return renderAccordionPart({ slot: 'itemTrigger', props });
}

/** Render the presence-controlled content for the nearest item. */
export function AccordionItemContent<As extends PrimitiveNativeTag = 'div'>(
  props: AccordionItemContentProps<As>,
): JSX.Element {
  return renderAccordionPart({ slot: 'itemContent', props });
}

/** Add authored content padding inside an Accordion panel. */
export function AccordionItemBody<As extends PrimitiveNativeTag = 'div'>(
  props: AccordionItemBodyProps<As>,
): JSX.Element {
  return renderAccordionPart({ slot: 'itemBody', props });
}

/** Render the primitive's disclosure indicator with a replaceable default chevron. */
export function AccordionItemIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: AccordionItemIndicatorProps<As>,
): JSX.Element {
  const indicatorProps = mergeProps({ children: <AccordionChevronIcon /> }, props);
  return renderAccordionPart({ slot: 'itemIndicator', props: indicatorProps });
}
