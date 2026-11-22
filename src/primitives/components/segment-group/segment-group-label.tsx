import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';

export type SegmentGroupLabelBaseProps = PolymorphicProps<'span'>;
export type SegmentGroupLabelProps = Assign<HTMLProps<'span'>, SegmentGroupLabelBaseProps>;

/** Render the SegmentGroup label. */
export const SegmentGroupLabel = (props: SegmentGroupLabelProps) => {
  const segmentGroup = useSegmentGroupContext();
  const mergedProps = mergeProps(() => segmentGroup().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
