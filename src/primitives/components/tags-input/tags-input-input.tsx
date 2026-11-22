import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useTagsInputContext } from './use-tags-input-context';

export type TagsInputInputBaseProps = PolymorphicProps<'input'>;
export type TagsInputInputProps = Assign<HTMLProps<'input'>, TagsInputInputBaseProps>;

/** Render the TagsInput input. */
export const TagsInputInput = (props: TagsInputInputProps) => {
  const api = useTagsInputContext();
  const mergedProps = mergeProps(() => api().getInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
