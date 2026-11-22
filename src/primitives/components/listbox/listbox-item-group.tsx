import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createUniqueId } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';
import { ListboxItemGroupPropsProvider } from './use-listbox-item-group-props-context';

export interface ListboxItemGroupBaseProps extends PolymorphicProps<'div'> {
  /** The group's id, which its label references. */
  id?: string | undefined;
}
export type ListboxItemGroupProps = Assign<HTMLProps<'div'>, ListboxItemGroupBaseProps>;

/** Render the Listbox item group. */
export const ListboxItemGroup = (props: ListboxItemGroupProps) => {
  const id = createUniqueId();
  const [_itemGroupProps, localProps] = createSplitProps<Pick<ListboxItemGroupBaseProps, 'id'>>()(
    props,
    ['id'],
  );
  const itemGroupProps = mergeProps({ id }, _itemGroupProps);

  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getItemGroupProps(itemGroupProps), localProps);

  return (
    <ListboxItemGroupPropsProvider value={itemGroupProps}>
      <primitive.div {...mergedProps} />
    </ListboxItemGroupPropsProvider>
  );
};
