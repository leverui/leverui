import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { ItemProps, ItemState } from '@zag-js/tags-input';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTagsInputContext } from './use-tags-input-context';
import { TagsInputItemProvider } from './use-tags-input-item-context';
import { TagsInputItemPropsProvider } from './use-tags-input-item-props-context';

export type TagsInputItemState = ItemState;

export type TagsInputItemBaseProps = ItemProps & PolymorphicProps<'div', TagsInputItemState>;
export type TagsInputItemProps = Assign<HTMLProps<'div'>, TagsInputItemBaseProps>;

/** Render the TagsInput item. */
export const TagsInputItem = (props: TagsInputItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'disabled',
    'index',
    'value',
  ]);
  const api = useTagsInputContext();
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => api().getItemState(itemProps));

  return (
    <TagsInputItemPropsProvider value={itemProps}>
      <TagsInputItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={api().getItemState(itemProps)} />
      </TagsInputItemProvider>
    </TagsInputItemPropsProvider>
  );
};
