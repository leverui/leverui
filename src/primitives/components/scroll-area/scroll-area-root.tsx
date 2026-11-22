import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseScrollAreaProps, useScrollArea } from './use-scroll-area';
import { ScrollAreaProvider } from './use-scroll-area-context';

export type ScrollAreaRootBaseProps = UseScrollAreaProps & PolymorphicProps<'div'>;
export type ScrollAreaRootProps = Assign<HTMLProps<'div'>, ScrollAreaRootBaseProps>;

/** Render the ScrollArea root. */
export const ScrollAreaRoot = (props: ScrollAreaRootProps) => {
  const [useScrollAreaProps, localProps] = createSplitProps<UseScrollAreaProps>()(props, [
    'id',
    'ids',
  ]);
  const scrollArea = useScrollArea(useScrollAreaProps);
  const mergedProps = mergeProps(() => scrollArea().getRootProps(), localProps);

  return (
    <ScrollAreaProvider value={scrollArea}>
      <primitive.div {...mergedProps} />
    </ScrollAreaProvider>
  );
};
