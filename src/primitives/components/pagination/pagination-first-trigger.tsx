import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { PaginationAnchorProps } from './use-pagination';
import { usePaginationContext } from './use-pagination-context';

export type PaginationFirstTriggerBaseProps = PolymorphicProps<'button' | 'a'>;
export type PaginationFirstTriggerProps = Assign<HTMLProps<'button'>, PaginationAnchorProps> &
  PaginationFirstTriggerBaseProps;

/** Render the Pagination first trigger. */
export const PaginationFirstTrigger = (props: PaginationFirstTriggerProps) => {
  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getFirstTriggerProps(), props);

  return (
    <Show
      when={api().type === 'button'}
      fallback={<primitive.a {...(mergedProps as HTMLProps<'a'>)} />}
    >
      <primitive.button {...(mergedProps as HTMLProps<'button'>)} />
    </Show>
  );
};
