import { type JSX } from '@solidjs/web';
import type { NativeElementTag } from './native-element-props';
import { renderTagPart } from './tag-part';
import type {
  TagEndElementProps,
  TagLabelProps,
  TagPartRuntimeProps,
  TagStartElementProps,
} from './tag-props';

/** Render the single-line Tag label inside its root. */
function TagLabelComponent(props: TagPartRuntimeProps): JSX.Element {
  return renderTagPart('TagLabel', 'label', props);
}

/** Render a nonshrinking icon or avatar before the label. */
function TagStartElementComponent(props: TagPartRuntimeProps): JSX.Element {
  return renderTagPart('TagStartElement', 'startElement', props);
}

/** Render an icon or close control after the label. */
function TagEndElementComponent(props: TagPartRuntimeProps): JSX.Element {
  return renderTagPart('TagEndElement', 'endElement', props);
}

/** Expose native label attributes and caller-owned child rendering. */
export const TagLabel = TagLabelComponent as <As extends NativeElementTag = 'span'>(
  props: TagLabelProps<As>,
) => JSX.Element;

/** Expose native leading-part attributes and caller-owned child rendering. */
export const TagStartElement = TagStartElementComponent as <As extends NativeElementTag = 'span'>(
  props: TagStartElementProps<As>,
) => JSX.Element;

/** Expose native trailing-part attributes and caller-owned child rendering. */
export const TagEndElement = TagEndElementComponent as <As extends NativeElementTag = 'span'>(
  props: TagEndElementProps<As>,
) => JSX.Element;
