import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';

export type TagsInputClearTriggerBaseProps = PolymorphicProps<'button'>;
export type TagsInputClearTriggerProps = Assign<
  HTMLProps<'button'>,
  TagsInputClearTriggerBaseProps
>;

/** Render the TagsInput clear trigger. */
export const TagsInputClearTrigger = (props: TagsInputClearTriggerProps) => {
  const api = useTagsInputContext();
  const mergedProps = mergeProps(() => api().getClearTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
