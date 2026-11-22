import { type JSX } from '@solidjs/web';
import { CloseIcon } from './close-icon';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderTagsInputPart, type TagsInputPartRenderProps } from './tags-input-part';
import type {
  TagsInputClearTriggerProps,
  TagsInputControlProps,
  TagsInputInputProps,
  TagsInputLabelProps,
} from './tags-input-part-props';

/** Associate a visible label with the Tags Input field. */
function TagsInputLabelImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('label', props);
}

/** Expose the label's native or selected element props. */
export const TagsInputLabel: <As extends PrimitiveNativeTag = 'label'>(
  props: TagsInputLabelProps<As>,
) => JSX.Element = TagsInputLabelImpl;

/** Group current tags, the text input, and optional controls. */
function TagsInputControlImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('control', props);
}

/** Expose the control's native or selected element props. */
export const TagsInputControl: <As extends PrimitiveNativeTag = 'div'>(
  props: TagsInputControlProps<As>,
) => JSX.Element = TagsInputControlImpl;

/** Render the machine-owned field for adding tags. */
function TagsInputInputImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('input', props);
}

/** Expose the input's native or selected element props. */
export const TagsInputInput: <As extends PrimitiveNativeTag = 'input'>(
  props: TagsInputInputProps<As>,
) => JSX.Element = TagsInputInputImpl;

/** Clear all tags through the current Tags Input machine. */
function TagsInputClearTriggerImpl(props: TagsInputPartRenderProps): JSX.Element {
  return renderTagsInputPart('clearTrigger', props, CloseIcon);
}

/** Expose the clear trigger's native or selected element props. */
export const TagsInputClearTrigger: <As extends PrimitiveNativeTag = 'button'>(
  props: TagsInputClearTriggerProps<As>,
) => JSX.Element = TagsInputClearTriggerImpl;
