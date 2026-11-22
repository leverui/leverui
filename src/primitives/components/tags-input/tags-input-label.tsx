import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';

export type TagsInputLabelBaseProps = PolymorphicProps<'label'>;
export type TagsInputLabelProps = Assign<HTMLProps<'label'>, TagsInputLabelBaseProps>;

/** Render the TagsInput label. */
export const TagsInputLabel = (props: TagsInputLabelProps) => {
  const api = useTagsInputContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
