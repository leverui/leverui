import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { Collapsible } from '../collapsible/index';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { useAccordionContext } from './use-accordion-context';
import { useAccordionItemPropsContext } from './use-accordion-item-props-context';

export type AccordionItemContentBaseProps = PolymorphicProps<'div'>;
export type AccordionItemContentProps = Assign<HTMLProps<'div'>, AccordionItemContentBaseProps>;

interface VisibilityProps {
  hidden?: boolean;
  'data-state'?: string;
}

const splitVisibilityProps = createSplitProps<VisibilityProps>();

/** Render the Accordion item content. */
export const AccordionItemContent = (props: AccordionItemContentProps) => {
  const accordion = useAccordionContext();
  const itemProps = useAccordionItemPropsContext();

  const itemContentProps = createMemo(() => {
    const contentProps = accordion().getItemContentProps(itemProps);
    const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, [
      'hidden',
      'data-state',
    ]);
    return ownProps;
  });
  const mergedProps = mergeProps(() => itemContentProps(), props);

  return <Collapsible.Content {...mergedProps} />;
};
