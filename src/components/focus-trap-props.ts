import type { FocusTrapBaseProps as PrimitiveFocusTrapBaseProps } from '../primitives/components/focus-trap';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type FocusTrapTag = NativeElementTag;

export type FocusTrapBehaviorProps = Pick<
  PrimitiveFocusTrapBaseProps,
  | 'disabled'
  | 'onActivate'
  | 'onDeactivate'
  | 'initialFocus'
  | 'fallbackFocus'
  | 'returnFocusOnDeactivate'
  | 'setReturnFocus'
  | 'persistentElements'
>;

/** Expose native HTML, selected tags, and owned children without object styling props. */
export type FocusTrapProps<As extends FocusTrapTag = 'div'> = NativeElementProps<
  'div',
  FocusTrapBehaviorProps,
  As
>;

/** Keep Zag's behavior options off the rendered HTML element. */
export const focusTrapOptionKeys = [
  'disabled',
  'onActivate',
  'onDeactivate',
  'initialFocus',
  'fallbackFocus',
  'returnFocusOnDeactivate',
  'setReturnFocus',
  'persistentElements',
] as const;
