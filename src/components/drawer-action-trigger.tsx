import { OverlayActionTrigger, type OverlayActionTriggerProps } from './overlay-action-trigger';
import type { NativeElementTag } from './native-element-props';

export type DrawerActionTriggerProps<As extends NativeElementTag = 'button'> =
  OverlayActionTriggerProps<As>;

/** Expose the native action under Drawer's public name. */
export const DrawerActionTrigger = OverlayActionTrigger;
