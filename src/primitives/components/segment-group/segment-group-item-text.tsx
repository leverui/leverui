import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context';

export type SegmentGroupItemTextBaseProps = PolymorphicProps<'span'>;
export type SegmentGroupItemTextProps = Assign<HTMLProps<'span'>, SegmentGroupItemTextBaseProps>;

/** Render the SegmentGroup item text. */
export const SegmentGroupItemText = (props: SegmentGroupItemTextProps) => {
  const segmentGroup = useSegmentGroupContext();
  const itemProps = useSegmentGroupItemPropsContext();
  const mergedProps = mergeProps(() => segmentGroup().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
