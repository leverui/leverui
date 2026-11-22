import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseScrollAreaReturn } from './use-scroll-area';
import { ScrollAreaProvider } from './use-scroll-area-context';

interface RootProviderProps {
  value: UseScrollAreaReturn;
}

export type ScrollAreaRootProviderBaseProps = PolymorphicProps<'div'>;
export type ScrollAreaRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  ScrollAreaRootProviderBaseProps;

/** Provide the ScrollArea root provider to its children. */
export const ScrollAreaRootProvider = (props: ScrollAreaRootProviderProps) => {
  const [{ value: scrollArea }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => scrollArea().getRootProps(), localProps);

  return (
    <ScrollAreaProvider value={scrollArea}>
      <primitive.div {...mergedProps} />
    </ScrollAreaProvider>
  );
};
