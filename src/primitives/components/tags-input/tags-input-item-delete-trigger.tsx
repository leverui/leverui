import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context';

export type TagsInputItemDeleteTriggerBaseProps = PolymorphicProps<'button'>;
export type TagsInputItemDeleteTriggerProps = Assign<
  HTMLProps<'button'>,
  TagsInputItemDeleteTriggerBaseProps
>;

/** Render the TagsInput item delete trigger. */
export const TagsInputItemDeleteTrigger = (props: TagsInputItemDeleteTriggerProps) => {
  const api = useTagsInputContext();
  const itemProps = useTagsInputItemPropsContext();
  const mergedProps = mergeProps(() => api().getItemDeleteTriggerProps(itemProps), props);

  return <primitive.button {...mergedProps} />;
};
