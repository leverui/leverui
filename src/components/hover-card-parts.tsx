import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderHoverCardPart } from './hover-card-part';
import type {
  HoverCardArrowProps,
  HoverCardArrowTipProps,
  HoverCardContentProps,
  HoverCardPositionerProps,
  HoverCardTriggerProps,
} from './hover-card-part-props';

/** Open the nearest HoverCard through hover, focus, or its trigger value. */
export function HoverCardTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: HoverCardTriggerProps<As>,
): JSX.Element {
  return renderHoverCardPart({ slot: 'trigger', props });
}

/** Position the HoverCard surface using the primitive's floating placement. */
export function HoverCardPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: HoverCardPositionerProps<As>,
): JSX.Element {
  return renderHoverCardPart({ slot: 'positioner', props });
}

/** Render the presence-controlled HoverCard surface. */
export function HoverCardContent<As extends PrimitiveNativeTag = 'div'>(
  props: HoverCardContentProps<As>,
): JSX.Element {
  return renderHoverCardPart({ slot: 'content', props });
}

/** Render the positioned arrow with an arrow tip by default. */
export function HoverCardArrow<As extends PrimitiveNativeTag = 'div'>(
  props: HoverCardArrowProps<As>,
): JSX.Element {
  return renderHoverCardPart({
    slot: 'arrow',
    props,
    /** Create the styled tip only when Arrow children are omitted. */
    defaultChildren: () => <HoverCardArrowTip />,
  });
}

/** Render the styled tip of the HoverCard arrow. */
export function HoverCardArrowTip<As extends PrimitiveNativeTag = 'div'>(
  props: HoverCardArrowTipProps<As>,
): JSX.Element {
  return renderHoverCardPart({ slot: 'arrowTip', props });
}
