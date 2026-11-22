import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import {
  renderNativeInline,
  type NativeInlineProps,
  type NativeInlineRuntimeProps,
} from './native-inline';

export type EmProps<As extends NativeElementTag = NativeElementTag> = NativeInlineProps<'em', As>;

/** Render semantic em through a native element and authored CSS. */
function EmRoot(props: NativeInlineRuntimeProps): JSX.Element {
  return renderNativeInline('em', 'em', props);
}

/** Expose native Em attributes with a selected-element ref. */
export const Em = EmRoot as <As extends NativeElementTag = 'em'>(props: EmProps<As>) => JSX.Element;
