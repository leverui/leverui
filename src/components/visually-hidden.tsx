import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import {
  renderNativeInline,
  type NativeInlineProps,
  type NativeInlineRuntimeProps,
} from './native-inline';

export type VisuallyHiddenProps<As extends NativeElementTag = 'span'> = NativeInlineProps<
  'span',
  As
>;

/** Render accessible inline content through the native authored-CSS path. */
function VisuallyHiddenRoot(props: NativeInlineRuntimeProps): JSX.Element {
  return renderNativeInline('visually-hidden', 'span', props);
}

/** Expose selected native elements and caller-owned children without object styling. */
export const VisuallyHidden = VisuallyHiddenRoot as <As extends NativeElementTag = 'span'>(
  props: VisuallyHiddenProps<As>,
) => JSX.Element;
