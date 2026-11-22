import { splitProps } from '../primitives/utils/split-props';
import { For } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderFloatingPanelPart } from './floating-panel-part';
import type {
  FloatingPanelBodyProps,
  FloatingPanelCloseTriggerProps,
  FloatingPanelContentProps,
  FloatingPanelControlProps,
  FloatingPanelDragTriggerProps,
  FloatingPanelHeaderProps,
  FloatingPanelPositionerProps,
  FloatingPanelResizeTriggerProps,
  FloatingPanelResizeTriggersProps,
  FloatingPanelStageTriggerProps,
  FloatingPanelTitleProps,
  FloatingPanelTriggerProps,
} from './floating-panel-part-props';

const defaultAxes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;

/** Open or toggle the nearest Floating Panel. */
export function FloatingPanelTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: FloatingPanelTriggerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'trigger', props });
}

/** Place the panel using the primitive's current position state. */
export function FloatingPanelPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelPositionerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'positioner', props });
}

/** Render the presence-controlled floating surface. */
export function FloatingPanelContent<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelContentProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'content', props });
}

/** Lay out the panel's draggable header and controls. */
export function FloatingPanelHeader<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelHeaderProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'header', props });
}

/** Lay out the panel's scrollable body. */
export function FloatingPanelBody<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelBodyProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'body', props });
}

/** Name the panel through the primitive's title relationship. */
export function FloatingPanelTitle<As extends PrimitiveNativeTag = 'h2'>(
  props: FloatingPanelTitleProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'title', props });
}

/** Move the panel by pointer or keyboard through the primitive's drag handle. */
export function FloatingPanelDragTrigger<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelDragTriggerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'dragTrigger', props });
}

/** Resize one edge or corner of the panel. */
export function FloatingPanelResizeTrigger<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelResizeTriggerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'resizeTrigger', props });
}

/** Render the requested resize handles, defaulting to all eight axes. */
export function FloatingPanelResizeTriggers<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelResizeTriggersProps<As>,
): JSX.Element {
  const [local, rest] = splitProps(props, ['axes']);

  /** Give each edge or corner an independently interactive primitive handle. */
  function renderAxis(placement: (typeof defaultAxes)[number]): JSX.Element {
    return renderFloatingPanelPart({
      slot: 'resizeTrigger',
      props: mergeProps(rest, { placement }),
    });
  }

  return <For each={local.axes ?? defaultAxes}>{renderAxis}</For>;
}

/** Minimize, maximize, or restore the nearest Floating Panel. */
export function FloatingPanelStageTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: FloatingPanelStageTriggerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'stageTrigger', props });
}

/** Close the panel using the primitive's focus restoration. */
export function FloatingPanelCloseTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: FloatingPanelCloseTriggerProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'closeTrigger', props });
}

/** Group stage and close controls in the panel header. */
export function FloatingPanelControl<As extends PrimitiveNativeTag = 'div'>(
  props: FloatingPanelControlProps<As>,
): JSX.Element {
  return renderFloatingPanelPart({ slot: 'control', props });
}
