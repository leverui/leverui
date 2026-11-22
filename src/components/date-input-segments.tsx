import { splitProps } from '../primitives/utils/split-props';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { DateInputSegmentGroupProps } from './date-input-part-props';
import { DateInputSegment, DateInputSegmentGroup } from './date-input-parts';
import { useDateInputContext } from './date-input-machine';

type WithoutChildrenAndIndex<Props> = Props extends unknown
  ? Omit<Props, 'children' | 'index'>
  : never;
export type DateInputSegmentsProps = WithoutChildrenAndIndex<DateInputSegmentGroupProps> & {
  index?: number;
};

/** Render every current date segment while preserving each segment's DOM node. */
export function DateInputSegments(props: DateInputSegmentsProps): JSX.Element {
  const machine = useDateInputContext();
  const [local, rest] = splitProps(props, ['index']);
  return (
    <DateInputSegmentGroup index={local.index} {...rest}>
      <For keyed={false} each={machine().getSegments({ index: local.index })}>
        {
          /** Keep each segment position stable as its date text changes. */
          (segment) => <DateInputSegment segment={segment()} />
        }
      </For>
    </DateInputSegmentGroup>
  );
}
