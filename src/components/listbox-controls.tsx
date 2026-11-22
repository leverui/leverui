import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderListboxPart } from './listbox-part';
import type {
  ListboxContentProps,
  ListboxEmptyProps,
  ListboxInputProps,
  ListboxLabelProps,
  ListboxListProps,
  ListboxStatusProps,
  ListboxValueTextProps,
} from './listbox-part-props';

/** Label the current Listbox collection and its selected value. */
export function ListboxLabel<As extends PrimitiveNativeTag = 'span'>(
  props: ListboxLabelProps<As>,
): JSX.Element {
  return renderListboxPart('label', props);
}

/** Render the primitive's optional filter input with its keyboard contract. */
export function ListboxInput<As extends PrimitiveNativeTag = 'input'>(
  props: ListboxInputProps<As>,
): JSX.Element {
  return renderListboxPart('input', props);
}

/** Display selected collection text or a caller placeholder. */
export function ListboxValueText<As extends PrimitiveNativeTag = 'span'>(
  props: ListboxValueTextProps<As>,
): JSX.Element {
  return renderListboxPart('valueText', props);
}

/** Wrap the list and any header, footer, or status content beside it. */
export function ListboxContent<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxContentProps<As>,
): JSX.Element {
  return renderListboxPart('content', props);
}

/** Expose the primitive's listbox role and collection navigation around the items. */
export function ListboxList<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxListProps<As>,
): JSX.Element {
  return renderListboxPart('list', props);
}

/** Announce loading or error states outside the list of options. */
export function ListboxStatus<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxStatusProps<As>,
): JSX.Element {
  return renderListboxPart('status', props);
}

/** Show fallback content for an empty collection; place it beside the List. */
export function ListboxEmpty<As extends PrimitiveNativeTag = 'div'>(
  props: ListboxEmptyProps<As>,
): JSX.Element {
  return renderListboxPart('empty', props);
}
