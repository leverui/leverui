import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderCollapsiblePart } from './collapsible-part';
import type {
  CollapsibleContentProps,
  CollapsibleIndicatorProps,
  CollapsibleTriggerProps,
} from './collapsible-part-props';

/** Render the primitive button that controls the Collapsible state. */
export function CollapsibleTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: CollapsibleTriggerProps<As>,
): JSX.Element {
  return renderCollapsiblePart({ slot: 'trigger', props });
}

/** Render the presence-aware Collapsible content. */
export function CollapsibleContent<As extends PrimitiveNativeTag = 'div'>(
  props: CollapsibleContentProps<As>,
): JSX.Element {
  return renderCollapsiblePart({ slot: 'content', props });
}

/** Reflect the Collapsible state on a caller-supplied indicator. */
export function CollapsibleIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: CollapsibleIndicatorProps<As>,
): JSX.Element {
  return renderCollapsiblePart({ slot: 'indicator', props });
}
