import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { PaginationAnchorProps } from './use-pagination';
import { usePaginationContext } from './use-pagination-context';

export type PaginationPreviousTriggerBaseProps = PolymorphicProps<'button' | 'a'>;
export type PaginationPreviousTriggerProps = Assign<HTMLProps<'button'>, PaginationAnchorProps> &
  PaginationPreviousTriggerBaseProps;

/** Render the Pagination previous trigger. */
export const PaginationPreviousTrigger = (props: PaginationPreviousTriggerProps) => {
  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getPreviousTriggerProps(), props);

  return (
    <Show
      when={api().type === 'button'}
      fallback={<primitive.a {...(mergedProps as HTMLProps<'a'>)} />}
    >
      <primitive.button {...(mergedProps as HTMLProps<'button'>)} />
    </Show>
  );
};
