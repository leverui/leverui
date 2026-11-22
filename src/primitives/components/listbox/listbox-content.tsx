import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/listbox';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';

export type ListboxContentState = ContentState;

export type ListboxContentBaseProps = PolymorphicProps<'div', ListboxContentState>;
export type ListboxContentProps = Assign<HTMLProps<'div'>, ListboxContentBaseProps>;

/** Render the Listbox content. */
export const ListboxContent = (props: ListboxContentProps) => {
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getContentProps(), props);

  return <primitive.div {...mergedProps} state={listbox().getContentState()} />;
};
