import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderPaginationPart } from './pagination-part';
import type {
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationNextTriggerProps,
  PaginationPrevTriggerProps,
} from './pagination-part-props';

/** Render an ellipsis at a machine-computed page gap. */
export function PaginationEllipsis<As extends PrimitiveNativeTag = 'div'>(
  props: PaginationEllipsisProps<As>,
): JSX.Element {
  return renderPaginationPart('ellipsis', props);
}

/** Render a page button or link with the primitive's current-page semantics. */
export function PaginationItem<As extends PrimitiveNativeTag = 'button'>(
  props: PaginationItemProps<As>,
): JSX.Element {
  return renderPaginationPart('item', props);
}

/** Advance to the next available page. */
export function PaginationNextTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: PaginationNextTriggerProps<As>,
): JSX.Element {
  return renderPaginationPart('nextTrigger', props);
}

/** Return to the previous available page. */
export function PaginationPrevTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: PaginationPrevTriggerProps<As>,
): JSX.Element {
  return renderPaginationPart('prevTrigger', props);
}
