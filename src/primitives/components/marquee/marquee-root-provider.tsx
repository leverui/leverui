import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseMarqueeReturn } from './use-marquee';
import { MarqueeProvider } from './use-marquee-context';

interface RootProviderProps {
  value: UseMarqueeReturn;
}

export type MarqueeRootProviderBaseProps = RootProviderProps & PolymorphicProps<'div'>;
export type MarqueeRootProviderProps = Assign<HTMLProps<'div'>, MarqueeRootProviderBaseProps>;

/** Provide the Marquee root provider to its children. */
export const MarqueeRootProvider = (props: MarqueeRootProviderProps) => {
  const [{ value: marquee }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => marquee().getRootProps(), localProps);

  return (
    <MarqueeProvider value={marquee}>
      <primitive.div {...mergedProps} />
    </MarqueeProvider>
  );
};
