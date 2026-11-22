import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context';

export type TagsInputItemInputBaseProps = PolymorphicProps<'input'>;
export type TagsInputItemInputProps = Assign<HTMLProps<'input'>, TagsInputItemInputBaseProps>;

/** Render the TagsInput item input. */
export const TagsInputItemInput = (props: TagsInputItemInputProps) => {
  const api = useTagsInputContext();
  const itemProps = useTagsInputItemPropsContext();
  const mergedProps = mergeProps(() => api().getItemInputProps(itemProps), props);

  return <primitive.input {...mergedProps} />;
};
