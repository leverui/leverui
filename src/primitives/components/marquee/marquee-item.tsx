import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMarqueeContext } from './use-marquee-context';

export type MarqueeItemBaseProps = PolymorphicProps<'div'>;
export type MarqueeItemProps = Assign<HTMLProps<'div'>, MarqueeItemBaseProps>;

/** Render the Marquee item. */
export const MarqueeItem = (props: MarqueeItemProps) => {
  const context = useMarqueeContext();
  const mergedProps = mergeProps(() => context().getItemProps(), props);
  return <primitive.div {...mergedProps} />;
};
