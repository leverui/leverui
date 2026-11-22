import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';
import { useListboxItemPropsContext } from './use-listbox-item-props-context';

export type ListboxItemTextBaseProps = PolymorphicProps<'span'>;
export type ListboxItemTextProps = Assign<HTMLProps<'span'>, ListboxItemTextBaseProps>;

/** Render the Listbox item text. */
export const ListboxItemText = (props: ListboxItemTextProps) => {
  const listbox = useListboxContext();
  const itemProps = useListboxItemPropsContext();
  const mergedProps = mergeProps(() => listbox().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
