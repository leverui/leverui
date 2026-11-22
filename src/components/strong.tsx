import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import {
  renderNativeInline,
  type NativeInlineProps,
  type NativeInlineRuntimeProps,
} from './native-inline';

export type StrongProps<As extends NativeElementTag = NativeElementTag> = NativeInlineProps<
  'strong',
  As
>;

/** Render semantic strong through a native element and authored CSS. */
function StrongRoot(props: NativeInlineRuntimeProps): JSX.Element {
  return renderNativeInline('strong', 'strong', props);
}

/** Expose native Strong attributes with a selected-element ref. */
export const Strong = StrongRoot as <As extends NativeElementTag = 'strong'>(
  props: StrongProps<As>,
) => JSX.Element;
