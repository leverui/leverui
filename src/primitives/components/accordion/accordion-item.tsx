import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/accordion';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { useRenderStrategyContext } from '../../utils/render-strategy';
import { Collapsible } from '../collapsible/index';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { useAccordionContext } from './use-accordion-context';
import { AccordionItemProvider } from './use-accordion-item-context';
import { AccordionItemPropsProvider } from './use-accordion-item-props-context';

export type AccordionItemState = ItemState;

export type AccordionItemBaseProps = ItemProps & PolymorphicProps<'div', AccordionItemState>;
export type AccordionItemProps = Assign<HTMLProps<'div'>, AccordionItemBaseProps>;

/** Render the Accordion item. */
export const AccordionItem = (props: AccordionItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'disabled']);
  const accordion = useAccordionContext();
  const renderStrategyProps = useRenderStrategyContext();
  const mergedProps = mergeProps(() => accordion().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => accordion().getItemState(itemProps));
  const itemContentProps = accordion().getItemContentProps(itemProps);

  return (
    <AccordionItemPropsProvider value={itemProps}>
      <AccordionItemProvider value={itemState}>
        <Collapsible.Root
          open={itemState().expanded}
          ids={itemContentProps.id ? { content: itemContentProps.id } : {}}
          {...renderStrategyProps}
          {...mergedProps}
          id={mergedProps.id || undefined}
          state={accordion().getItemState(itemProps)}
        />
      </AccordionItemProvider>
    </AccordionItemPropsProvider>
  );
};
