import { type JSX } from '@solidjs/web';
import {
  type UseTagsInputItemContext,
  useTagsInputItemContext,
} from './use-tags-input-item-context';

export interface TagsInputItemContextProps {
  children: (context: UseTagsInputItemContext) => JSX.Element;
}

/** Render the TagsInput item context through a function child. */
export const TagsInputItemContext = (props: TagsInputItemContextProps) =>
  props.children(useTagsInputItemContext());
