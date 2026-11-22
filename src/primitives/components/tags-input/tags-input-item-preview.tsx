import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context';

export type TagsInputItemPreviewBaseProps = PolymorphicProps<'div'>;
export type TagsInputItemPreviewProps = Assign<HTMLProps<'div'>, TagsInputItemPreviewBaseProps>;

/** Render the TagsInput item preview. */
export const TagsInputItemPreview = (props: TagsInputItemPreviewProps) => {
  const api = useTagsInputContext();
  const itemProps = useTagsInputItemPropsContext();
  const mergedProps = mergeProps(() => api().getItemPreviewProps(itemProps), props);

  return <primitive.div {...mergedProps} />;
};
