import { type JSX } from '@solidjs/web';
import { CloseIcon } from './close-icon';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderTagsInputPart, type TagsInputPartRenderProps } from './tags-input-part';
import type {
  TagsInputItemDeleteTriggerProps,
  TagsInputItemInputProps,
  TagsInputItemPreviewProps,
  TagsInputItemProps,
  TagsInputItemTextProps,
} from './tags-input-part-props';

/** Provide one indexed tag's state to its compound parts. */
function TagsInputItemImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('item', props);
}

/** Expose required value and index with native item props. */
export const TagsInputItem: <As extends PrimitiveNativeTag = 'div'>(
  props: TagsInputItemProps<As>,
) => JSX.Element = TagsInputItemImpl;

/** Render a tag's visible text in its preview. */
function TagsInputItemTextImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('itemText', props);
}

/** Expose the item's text span and polymorphic alternatives. */
export const TagsInputItemText: <As extends PrimitiveNativeTag = 'span'>(
  props: TagsInputItemTextProps<As>,
) => JSX.Element = TagsInputItemTextImpl;

/** Delete one tag through the current item context. */
function TagsInputItemDeleteTriggerImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('itemDeleteTrigger', props, CloseIcon);
}

/** Expose the tag deletion button and polymorphic alternatives. */
export const TagsInputItemDeleteTrigger: <As extends PrimitiveNativeTag = 'button'>(
  props: TagsInputItemDeleteTriggerProps<As>,
) => JSX.Element = TagsInputItemDeleteTriggerImpl;

/** Group a tag's text and delete trigger while showing its current state. */
function TagsInputItemPreviewImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('itemPreview', props);
}

/** Expose the item's preview container props. */
export const TagsInputItemPreview: <As extends PrimitiveNativeTag = 'div'>(
  props: TagsInputItemPreviewProps<As>,
) => JSX.Element = TagsInputItemPreviewImpl;

/** Render the inline editor for an editable tag. */
function TagsInputItemInputImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('itemInput', props);
}

/** Expose the inline editor's native input props. */
export const TagsInputItemInput: <As extends PrimitiveNativeTag = 'input'>(
  props: TagsInputItemInputProps<As>,
) => JSX.Element = TagsInputItemInputImpl;
