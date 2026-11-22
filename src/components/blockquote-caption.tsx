import { type JSX } from '@solidjs/web';
import { renderBlockquotePart } from './blockquote-part';
import type { NativeElementTag } from './native-element-props';
import type { BlockquoteCaptionProps, BlockquotePartRuntimeProps } from './blockquote-props';

/** Render attribution as the quote figure's native caption. */
function BlockquoteCaptionComponent(props: BlockquotePartRuntimeProps): JSX.Element {
  return renderBlockquotePart('BlockquoteCaption', 'figcaption', 'caption', props);
}

/** Expose native caption attributes and caller-owned children. */
export const BlockquoteCaption = BlockquoteCaptionComponent as <
  As extends NativeElementTag = 'figcaption',
>(
  props: BlockquoteCaptionProps<As>,
) => JSX.Element;
