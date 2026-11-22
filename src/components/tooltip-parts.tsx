import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderTooltipPart } from './tooltip-part';
import type {
  TooltipArrowProps,
  TooltipArrowTipProps,
  TooltipContentProps,
  TooltipPositionerProps,
  TooltipTriggerProps,
} from './tooltip-part-props';

/** Open the nearest Tooltip through hover, focus, or its trigger value. */
export function TooltipTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: TooltipTriggerProps<As>,
): JSX.Element {
  return renderTooltipPart({ slot: 'trigger', props });
}

/** Position the Tooltip surface using the primitive's floating placement. */
export function TooltipPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: TooltipPositionerProps<As>,
): JSX.Element {
  return renderTooltipPart({ slot: 'positioner', props });
}

/** Render the presence-controlled Tooltip surface. */
export function TooltipContent<As extends PrimitiveNativeTag = 'div'>(
  props: TooltipContentProps<As>,
): JSX.Element {
  return renderTooltipPart({ slot: 'content', props });
}

/** Render the positioned arrow with an arrow tip by default. */
export function TooltipArrow<As extends PrimitiveNativeTag = 'div'>(
  props: TooltipArrowProps<As>,
): JSX.Element {
  return renderTooltipPart({
    slot: 'arrow',
    props,
    /** Create the styled tip only when Arrow children are omitted. */
    defaultChildren: () => <TooltipArrowTip />,
  });
}

/** Render the styled tip of the Tooltip arrow. */
export function TooltipArrowTip<As extends PrimitiveNativeTag = 'div'>(
  props: TooltipArrowTipProps<As>,
): JSX.Element {
  return renderTooltipPart({ slot: 'arrowTip', props });
}
