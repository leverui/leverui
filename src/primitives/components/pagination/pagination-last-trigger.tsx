import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { PaginationAnchorProps } from './use-pagination';
import { usePaginationContext } from './use-pagination-context';

export type PaginationLastTriggerBaseProps = PolymorphicProps<'button' | 'a'>;
export type PaginationLastTriggerProps = Assign<HTMLProps<'button'>, PaginationAnchorProps> &
  PaginationLastTriggerBaseProps;

/** Render the Pagination last trigger. */
export const PaginationLastTrigger = (props: PaginationLastTriggerProps) => {
  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getLastTriggerProps(), props);

  return (
    <Show
      when={api().type === 'button'}
      fallback={<primitive.a {...(mergedProps as HTMLProps<'a'>)} />}
    >
      <primitive.button {...(mergedProps as HTMLProps<'button'>)} />
    </Show>
  );
};
