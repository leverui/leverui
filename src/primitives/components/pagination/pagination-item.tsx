import type { ItemProps, ItemState } from '@zag-js/pagination';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { PaginationAnchorProps } from './use-pagination';
import { usePaginationContext } from './use-pagination-context';

export type PaginationItemState = ItemState;

export type PaginationItemBaseProps = ItemProps &
  PolymorphicProps<'button' | 'a', PaginationItemState>;
export type PaginationItemProps = Assign<
  HTMLProps<'button'>,
  PaginationAnchorProps & PaginationItemBaseProps
>;

/** Render the Pagination item. */
export const PaginationItem = (props: PaginationItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'type']);

  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps);

  return (
    <Show
      when={api().type === 'button'}
      fallback={
        <primitive.a {...(mergedProps as HTMLProps<'a'>)} state={api().getItemState(itemProps)} />
      }
    >
      <primitive.button
        {...(mergedProps as HTMLProps<'button'>)}
        state={api().getItemState(itemProps)}
      />
    </Show>
  );
};
