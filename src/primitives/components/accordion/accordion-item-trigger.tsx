import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { mergeProps } from '../../utils/merge-part-props';

import { useCollapsibleContext } from '../collapsible/index';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useAccordionContext } from './use-accordion-context';
import { useAccordionItemPropsContext } from './use-accordion-item-props-context';

export type AccordionItemTriggerBaseProps = PolymorphicProps<'button'>;
export type AccordionItemTriggerProps = Assign<HTMLProps<'button'>, AccordionItemTriggerBaseProps>;

/** Render the Accordion item trigger. */
export const AccordionItemTrigger = (props: AccordionItemTriggerProps) => {
  const accordion = useAccordionContext();
  const itemProps = useAccordionItemPropsContext();
  const collapsible = useCollapsibleContext();

  const mergedProps = mergeProps(() => accordion().getItemTriggerProps(itemProps), props);
  const [ariaControls, buttonProps] = splitProps(mergedProps, ['aria-controls']);

  // Solid 2's JSX spreads need an object; reference the content only while it is mounted.
  return (
    <primitive.button
      {...buttonProps}
      aria-controls={collapsible().unmounted ? undefined : ariaControls['aria-controls']}
    />
  );
};
