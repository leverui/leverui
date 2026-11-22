import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMarqueeContext } from './use-marquee-context';

export type MarqueeViewportBaseProps = PolymorphicProps<'div'>;
export type MarqueeViewportProps = Assign<HTMLProps<'div'>, MarqueeViewportBaseProps>;

/** Render the Marquee viewport. */
export const MarqueeViewport = (props: MarqueeViewportProps) => {
  const context = useMarqueeContext();
  const mergedProps = mergeProps(() => context().getViewportProps(), props);
  return <primitive.div {...mergedProps} />;
};
