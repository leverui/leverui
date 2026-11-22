import { type JSX } from '@solidjs/web';
import { type UseTagsInputContext, useTagsInputContext } from './use-tags-input-context';

export interface TagsInputContextProps {
  children: (context: UseTagsInputContext) => JSX.Element;
}

/** Render the TagsInput context context through a function child. */
export const TagsInputContext = (props: TagsInputContextProps) =>
  props.children(useTagsInputContext());
