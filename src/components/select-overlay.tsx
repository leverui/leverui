import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderSelectPart } from './select-part';
import type {
  SelectContentProps,
  SelectListProps,
  SelectPositionerProps,
  SelectStatusProps,
} from './select-part-props';

/** Position Select's collection using the primitive's floating placement. */
export function SelectPositioner<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectPositionerProps<As>,
): JSX.Element {
  return renderSelectPart('positioner', props);
}

/** Render the presence-aware collection surface. */
export function SelectContent<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectContentProps<As>,
): JSX.Element {
  return renderSelectPart('content', props);
}

/** Expose the collection list's the primitive role and focus behavior. */
export function SelectList<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectListProps<As>,
): JSX.Element {
  return renderSelectPart('list', props);
}

/** Announce loading or error states beside the list of options. */
export function SelectStatus<As extends ComponentIntrinsicElement = 'div'>(
  props: SelectStatusProps<As>,
): JSX.Element {
  return renderSelectPart('status', props);
}
