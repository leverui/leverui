import { Toast as PrimitiveToast } from '../primitives/components/toast';

/** Map Toast parts to their default native tags. */
export const toastPartTags = {
  content: 'div',
  title: 'div',
  description: 'div',
  actionTrigger: 'button',
  closeTrigger: 'button',
} as const;

export type ToastPartSlot = keyof typeof toastPartTags;

/** Pair public part hooks with the primitive's behavior components. */
export const toastPartComponents = {
  content: PrimitiveToast.Content,
  title: PrimitiveToast.Title,
  description: PrimitiveToast.Description,
  actionTrigger: PrimitiveToast.ActionTrigger,
  closeTrigger: PrimitiveToast.CloseTrigger,
} as const;
