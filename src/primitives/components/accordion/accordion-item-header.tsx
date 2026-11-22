import type { Assign } from '../../types';
import type { ItemState } from '@zag-js/accordion';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useAccordionContext } from './use-accordion-context';
import { useAccordionItemPropsContext } from './use-accordion-item-props-context';

export type AccordionItemHeaderState = ItemState;

export type AccordionItemHeaderBaseProps = PolymorphicProps<'h3', AccordionItemHeaderState>;
export type AccordionItemHeaderProps = Assign<HTMLProps<'h3'>, AccordionItemHeaderBaseProps>;

/** Render the Accordion item header. */
export const AccordionItemHeader = (props: AccordionItemHeaderProps) => {
  const accordion = useAccordionContext();
  const itemProps = useAccordionItemPropsContext();
  const mergedProps = mergeProps(() => accordion().getItemHeaderProps(itemProps), props);

  return <primitive.h3 {...mergedProps} state={accordion().getItemState(itemProps)} />;
};
