import type { Assign } from '../../types';
import type { SegmentGroupProps, SegmentGroupState } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDateInputContext } from './use-date-input-context';
import { DateInputSegmentGroupPropsProvider } from './use-date-input-segment-group-props-context';

export type DateInputSegmentGroupState = SegmentGroupState;

export type DateInputSegmentGroupBaseProps = PolymorphicProps<'div', DateInputSegmentGroupState> &
  SegmentGroupProps;
export type DateInputSegmentGroupProps = Assign<HTMLProps<'div'>, DateInputSegmentGroupBaseProps>;

const splitSegmentGroupProps = createSplitProps<SegmentGroupProps>();

/** Render the DateInput segment group. */
export const DateInputSegmentGroup = (props: DateInputSegmentGroupProps) => {
  const api = useDateInputContext();
  const [segmentGroupProps, localProps] = splitSegmentGroupProps(props, ['index']);
  const mergedProps = mergeProps(() => api().getSegmentGroupProps(segmentGroupProps), localProps);
  return (
    <DateInputSegmentGroupPropsProvider value={segmentGroupProps}>
      <primitive.div {...mergedProps} state={api().getSegmentGroupState(segmentGroupProps)} />
    </DateInputSegmentGroupPropsProvider>
  );
};
