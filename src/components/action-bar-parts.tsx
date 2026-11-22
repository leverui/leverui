import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderActionBarPart } from './action-bar-part';
import type {
  ActionBarCloseTriggerProps,
  ActionBarContentProps,
  ActionBarPositionerProps,
  ActionBarSelectionTriggerProps,
  ActionBarSeparatorProps,
} from './action-bar-part-props';

/** Render the fixed, pointer-transparent Action Bar positioner. */
export function ActionBarPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: ActionBarPositionerProps<As>,
): JSX.Element {
  return renderActionBarPart({ slot: 'positioner', props });
}

/** Render the presence-controlled primitive Popover content. */
export function ActionBarContent<As extends PrimitiveNativeTag = 'div'>(
  props: ActionBarContentProps<As>,
): JSX.Element {
  return renderActionBarPart({ slot: 'content', props });
}

/** Separate the selection count from its available actions. */
export function ActionBarSeparator<As extends PrimitiveNativeTag = 'div'>(
  props: ActionBarSeparatorProps<As>,
): JSX.Element {
  return renderActionBarPart({ slot: 'separator', props });
}

/** Show the selection count in a non-submitting button by default. */
export function ActionBarSelectionTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: ActionBarSelectionTriggerProps<As>,
): JSX.Element {
  return renderActionBarPart({ slot: 'selectionTrigger', props });
}

/** Close the nearest Action Bar through the primitive's Popover state. */
export function ActionBarCloseTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: ActionBarCloseTriggerProps<As>,
): JSX.Element {
  return renderActionBarPart({ slot: 'closeTrigger', props });
}
