import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';

export type TagsInputControlBaseProps = PolymorphicProps<'div'>;
export type TagsInputControlProps = Assign<HTMLProps<'div'>, TagsInputControlBaseProps>;

/** Render the TagsInput control. */
export const TagsInputControl = (props: TagsInputControlProps) => {
  const api = useTagsInputContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
