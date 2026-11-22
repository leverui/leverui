import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { PaginationAnchorProps } from './use-pagination';
import { usePaginationContext } from './use-pagination-context';

export type PaginationNextTriggerBaseProps = PolymorphicProps<'button' | 'a'>;
export type PaginationNextTriggerProps = Assign<HTMLProps<'button'>, PaginationAnchorProps> &
  PaginationNextTriggerBaseProps;

/** Render the Pagination next trigger. */
export const PaginationNextTrigger = (props: PaginationNextTriggerProps) => {
  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getNextTriggerProps(), props);

  return (
    <Show
      when={api().type === 'button'}
      fallback={<primitive.a {...(mergedProps as HTMLProps<'a'>)} />}
    >
      <primitive.button {...(mergedProps as HTMLProps<'button'>)} />
    </Show>
  );
};
