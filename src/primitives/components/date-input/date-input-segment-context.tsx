import type { DateSegment } from '@zag-js/date-input';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useDateInputContext } from './use-date-input-context';
import { useDateInputSegmentGroupPropsContext } from './use-date-input-segment-group-props-context';

export interface DateInputSegmentContextProps {
  children: (segment: DateSegment) => JSX.Element;
}

/** Render the DateInput segment context. */
export const DateInputSegmentContext = (props: DateInputSegmentContextProps) => {
  const api = useDateInputContext();
  const segmentGroupProps = useDateInputSegmentGroupPropsContext();
  return (
    <For keyed={false} each={api().getSegments(segmentGroupProps)}>
      {(segment, index) => props.children({ ...segment(), index } as DateSegment)}
    </For>
  );
};
