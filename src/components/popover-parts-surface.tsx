import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderPopoverPart } from './popover-part';
import type {
  PopoverAnchorProps,
  PopoverArrowProps,
  PopoverArrowTipProps,
  PopoverCloseTriggerProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverPositionerProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from './popover-part-props';

/** Position a Popover relative to an element other than its trigger. */
export function PopoverAnchor<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverAnchorProps<As>,
): JSX.Element {
  return renderPopoverPart('anchor', props);
}

/** Open the nearest Popover through pointer or keyboard activation. */
export function PopoverTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: PopoverTriggerProps<As>,
): JSX.Element {
  return renderPopoverPart('trigger', props);
}

/** Position the Popover surface with the primitive's floating placement. */
export function PopoverPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverPositionerProps<As>,
): JSX.Element {
  return renderPopoverPart('positioner', props);
}

/** Render the presence-controlled Popover surface. */
export function PopoverContent<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverContentProps<As>,
): JSX.Element {
  return renderPopoverPart('content', props);
}

/** Render the positioned arrow with a tip by default. */
export function PopoverArrow<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverArrowProps<As>,
): JSX.Element {
  return renderPopoverPart(
    'arrow',
    props,
    /** Create the tip only when Arrow children are omitted. */
    () => <PopoverArrowTip />,
  );
}

/** Render the styled tip of the Popover arrow. */
export function PopoverArrowTip<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverArrowTipProps<As>,
): JSX.Element {
  return renderPopoverPart('arrowTip', props);
}

/** Dismiss the owning Popover through the primitive's close behavior. */
export function PopoverCloseTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: PopoverCloseTriggerProps<As>,
): JSX.Element {
  return renderPopoverPart('closeTrigger', props);
}

/** Name the Popover surface for assistive technology. */
export function PopoverTitle<As extends PrimitiveNativeTag = 'h2'>(
  props: PopoverTitleProps<As>,
): JSX.Element {
  return renderPopoverPart('title', props);
}

/** Describe the Popover surface for assistive technology. */
export function PopoverDescription<As extends PrimitiveNativeTag = 'div'>(
  props: PopoverDescriptionProps<As>,
): JSX.Element {
  return renderPopoverPart('description', props);
}
