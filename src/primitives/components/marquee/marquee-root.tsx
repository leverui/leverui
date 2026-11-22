import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseMarqueeProps, useMarquee } from './use-marquee';
import { MarqueeProvider } from './use-marquee-context';

export type MarqueeRootBaseProps = UseMarqueeProps & PolymorphicProps<'div'>;
export type MarqueeRootProps = Assign<HTMLProps<'div'>, MarqueeRootBaseProps>;

/** Render the Marquee root. */
export const MarqueeRoot = (props: MarqueeRootProps) => {
  const [useMarqueeProps, localProps] = createSplitProps<UseMarqueeProps>()(props, [
    'autoFill',
    'defaultPaused',
    'delay',
    'id',
    'ids',
    'loopCount',
    'onComplete',
    'onLoopComplete',
    'onPauseChange',
    'paused',
    'pauseOnInteraction',
    'reverse',
    'side',
    'spacing',
    'speed',
    'translations',
  ]);

  const context = useMarquee(useMarqueeProps);
  const mergedProps = mergeProps(() => context().getRootProps(), localProps);

  return (
    <MarqueeProvider value={context}>
      <primitive.div {...mergedProps} />
    </MarqueeProvider>
  );
};
