import { type JSX } from '@solidjs/web';
import { renderBlockquotePart } from './blockquote-part';
import type { NativeElementTag } from './native-element-props';
import type { BlockquoteContentProps, BlockquotePartRuntimeProps } from './blockquote-props';

/** Render quoted content in a semantic native blockquote. */
function BlockquoteContentComponent(props: BlockquotePartRuntimeProps): JSX.Element {
  return renderBlockquotePart('BlockquoteContent', 'blockquote', 'content', props);
}

/** Expose native attributes, selected tags, and caller-owned children. */
export const BlockquoteContent = BlockquoteContentComponent as <
  As extends NativeElementTag = 'blockquote',
>(
  props: BlockquoteContentProps<As>,
) => JSX.Element;
