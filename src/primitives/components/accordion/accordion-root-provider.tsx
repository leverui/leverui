import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import {
  type RenderStrategyProps,
  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '../../utils/render-strategy';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseAccordionReturn } from './use-accordion';
import { AccordionProvider } from './use-accordion-context';

interface RootProviderProps {
  value: UseAccordionReturn;
}

export type AccordionRootProviderBaseProps = RootProviderProps &
  RenderStrategyProps &
  PolymorphicProps<'div'>;
export type AccordionRootProviderProps = Assign<HTMLProps<'div'>, AccordionRootProviderBaseProps>;

/** Provide the Accordion root provider to its children. */
export const AccordionRootProvider = (props: AccordionRootProviderProps) => {
  const [renderStrategyProps, accordionProps] = splitRenderStrategyProps(props);
  const [{ value: accordion }, localProps] = createSplitProps<RootProviderProps>()(accordionProps, [
    'value',
  ]);

  const mergedProps = mergeProps(() => accordion().getRootProps(), localProps);

  return (
    <AccordionProvider value={accordion}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </AccordionProvider>
  );
};
