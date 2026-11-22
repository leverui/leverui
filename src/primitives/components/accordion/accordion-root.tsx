import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import {
  type RenderStrategyProps,
  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseAccordionProps, useAccordion } from './use-accordion';
import { AccordionProvider } from './use-accordion-context';

export type AccordionRootBaseProps = UseAccordionProps &
  RenderStrategyProps &
  PolymorphicProps<'div'>;
export type AccordionRootProps = Assign<HTMLProps<'div'>, AccordionRootBaseProps>;

/** Render the Accordion root. */
export const AccordionRoot = (props: AccordionRootProps) => {
  const [renderStrategyProps, accordionProps] = splitRenderStrategyProps(props);
  const [useAccordionProps, localProps] = createSplitProps<UseAccordionProps>()(accordionProps, [
    'collapsible',
    'defaultValue',
    'disabled',
    'hiddenUntilFound',
    'id',
    'ids',
    'multiple',
    'onFocusChange',
    'onValueChange',
    'orientation',
    'value',
  ]);
  const api = useAccordion(useAccordionProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <AccordionProvider value={api}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </AccordionProvider>
  );
};
