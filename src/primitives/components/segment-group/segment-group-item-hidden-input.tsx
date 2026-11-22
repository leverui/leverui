import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context';

export type SegmentGroupItemHiddenInputBaseProps = PolymorphicProps<'input'>;
export type SegmentGroupItemHiddenInputProps = Assign<
  HTMLProps<'input'>,
  SegmentGroupItemHiddenInputBaseProps
>;

/** Render the SegmentGroup item hidden input. */
export const SegmentGroupItemHiddenInput = (props: SegmentGroupItemHiddenInputProps) => {
  const segmentGroup = useSegmentGroupContext();
  const itemProps = useSegmentGroupItemPropsContext();
  const mergedProps = mergeProps(() => segmentGroup().getItemHiddenInputProps(itemProps), props);

  return <primitive.input {...mergedProps} />;
};
