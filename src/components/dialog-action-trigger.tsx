import { OverlayActionTrigger, type OverlayActionTriggerProps } from './overlay-action-trigger';
import type { NativeElementTag } from './native-element-props';

export type DialogActionTriggerProps<As extends NativeElementTag = 'button'> =
  OverlayActionTriggerProps<As>;

/** Expose the native action under Dialog's public name. */
export const DialogActionTrigger = OverlayActionTrigger;
