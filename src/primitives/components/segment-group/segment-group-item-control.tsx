import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context';

export type SegmentGroupItemControlBaseProps = PolymorphicProps<'span'>;
export type SegmentGroupItemControlProps = Assign<
  HTMLProps<'span'>,
  SegmentGroupItemControlBaseProps
>;

/** Render the SegmentGroup item control. */
export const SegmentGroupItemControl = (props: SegmentGroupItemControlProps) => {
  const segmentGroup = useSegmentGroupContext();
  const itemProps = useSegmentGroupItemPropsContext();
  const mergedProps = mergeProps(() => segmentGroup().getItemControlProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
