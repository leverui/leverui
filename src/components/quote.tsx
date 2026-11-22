import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import {
  renderNativeInline,
  type NativeInlineProps,
  type NativeInlineRuntimeProps,
} from './native-inline';

export type QuoteProps<As extends NativeElementTag = 'q'> = NativeInlineProps<'q', As>;

/** Render semantic quote through a native element and authored CSS. */
function QuoteRoot(props: NativeInlineRuntimeProps): JSX.Element {
  return renderNativeInline('quote', 'q', props);
}

/** Expose native Quote attributes with a selected-element ref. */
export const Quote = QuoteRoot as <As extends NativeElementTag = 'q'>(
  props: QuoteProps<As>,
) => JSX.Element;
