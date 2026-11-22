import { type JSX } from '@solidjs/web';
import { type UseSegmentGroupContext, useSegmentGroupContext } from './use-segment-group-context';

export interface SegmentGroupContextProps {
  children: (context: UseSegmentGroupContext) => JSX.Element;
}

/** Render the SegmentGroup context context through a function child. */
export const SegmentGroupContext = (props: SegmentGroupContextProps) =>
  props.children(useSegmentGroupContext());
