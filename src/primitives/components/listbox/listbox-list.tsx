import type { Assign } from '../../types';
import type { ListState } from '@zag-js/listbox';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';

export type ListboxListState = ListState;

export type ListboxListBaseProps = PolymorphicProps<'div', ListboxListState>;
export type ListboxListProps = Assign<HTMLProps<'div'>, ListboxListBaseProps>;

/** Render the Listbox list. */
export const ListboxList = (props: ListboxListProps) => {
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getListProps(), props);

  return <primitive.div {...mergedProps} state={listbox().getListState()} />;
};
