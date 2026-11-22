import { type JSX } from '@solidjs/web';
import {
  type UseSegmentGroupItemContext,
  useSegmentGroupItemContext,
} from './use-segment-group-item-context';

export interface SegmentGroupItemContextProps {
  children: (context: UseSegmentGroupItemContext) => JSX.Element;
}

/** Render the SegmentGroup item context. */
export const SegmentGroupItemContext = (props: SegmentGroupItemContextProps) =>
  props.children(useSegmentGroupItemContext());
