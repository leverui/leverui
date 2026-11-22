import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context';

export type TagsInputItemTextBaseProps = PolymorphicProps<'span'>;
export type TagsInputItemTextProps = Assign<HTMLProps<'span'>, TagsInputItemTextBaseProps>;

/** Render the TagsInput item text. */
export const TagsInputItemText = (props: TagsInputItemTextProps) => {
  const api = useTagsInputContext();
  const itemProps = useTagsInputItemPropsContext();
  const mergedProps = mergeProps(() => api().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
