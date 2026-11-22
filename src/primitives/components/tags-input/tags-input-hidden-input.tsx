import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useTagsInputContext } from './use-tags-input-context';

export type TagsInputHiddenInputBaseProps = PolymorphicProps<'input'>;
export type TagsInputHiddenInputProps = Assign<HTMLProps<'input'>, TagsInputHiddenInputBaseProps>;

/** Render the TagsInput hidden input. */
export const TagsInputHiddenInput = (props: TagsInputHiddenInputProps) => {
  const tagsInput = useTagsInputContext();
  const mergedProps = mergeProps(() => tagsInput().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
