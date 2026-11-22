import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';

export type SegmentGroupIndicatorBaseProps = PolymorphicProps<'div'>;
export type SegmentGroupIndicatorProps = Assign<HTMLProps<'div'>, SegmentGroupIndicatorBaseProps>;

/** Render the SegmentGroup indicator. */
export const SegmentGroupIndicator = (props: SegmentGroupIndicatorProps) => {
  const segmentGroup = useSegmentGroupContext();
  const mergedProps = mergeProps(() => segmentGroup().getIndicatorProps(), props);

  return <primitive.div {...mergedProps} />;
};
