import type { Assign } from '../../types';
import type { SegmentProps, SegmentState } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDateInputContext } from './use-date-input-context';
import { useDateInputSegmentGroupPropsContext } from './use-date-input-segment-group-props-context';

export type DateInputSegmentState = SegmentState;

export type DateInputSegmentBaseProps = PolymorphicProps<'span', DateInputSegmentState> &
  Pick<SegmentProps, 'segment'>;
export type DateInputSegmentProps = Assign<HTMLProps<'span'>, DateInputSegmentBaseProps>;

const splitSegmentProps = createSplitProps<Pick<SegmentProps, 'segment'>>();

type IndexedSegment = SegmentProps['segment'] & { index?: number };

/** Render the DateInput segment. */
export const DateInputSegment = (props: DateInputSegmentProps) => {
  const [segmentProps, localProps] = splitSegmentProps(props, ['segment']);
  const segmentGroupProps = useDateInputSegmentGroupPropsContext();
  const api = useDateInputContext();

  // `type` alone doesn't identify a segment, since multiple segments can share it (e.g. `literal`)
  const currentSegment = createMemo(() => {
    const index = (segmentProps.segment as IndexedSegment).index;
    const segments = api().getSegments(segmentGroupProps);
    return (typeof index === 'number' ? segments[index] : undefined) ?? segmentProps.segment;
  });

  const mergedProps = mergeProps(
    () => api().getSegmentProps({ segment: currentSegment(), index: segmentGroupProps.index }),
    localProps,
  );
  return (
    <primitive.span
      {...mergedProps}
      state={api().getSegmentState({ segment: currentSegment(), index: segmentGroupProps.index })}
    >
      {currentSegment().text}
    </primitive.span>
  );
};
