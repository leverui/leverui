import { type JSX } from '@solidjs/web';
import { type UseAccordionContext, useAccordionContext } from './use-accordion-context';

export interface AccordionContextProps {
  children: (context: UseAccordionContext) => JSX.Element;
}

/** Render the Accordion context context through a function child. */
export const AccordionContext = (props: AccordionContextProps) =>
  props.children(useAccordionContext());
