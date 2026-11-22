import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useAccordionContext } from './use-accordion-context';
import { useAccordionItemPropsContext } from './use-accordion-item-props-context';

export type AccordionItemIndicatorBaseProps = PolymorphicProps<'span'>;
export type AccordionItemIndicatorProps = Assign<
  HTMLProps<'span'>,
  AccordionItemIndicatorBaseProps
>;

/** Render the Accordion item indicator. */
export const AccordionItemIndicator = (props: AccordionItemIndicatorProps) => {
  const accordion = useAccordionContext();
  const itemProps = useAccordionItemPropsContext();
  const mergedProps = mergeProps(() => accordion().getItemIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
