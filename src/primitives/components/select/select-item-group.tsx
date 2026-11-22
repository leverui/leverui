import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createUniqueId } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';
import { SelectItemGroupPropsProvider } from './use-select-item-group-props-context';

export interface SelectItemGroupBaseProps extends PolymorphicProps<'div'> {
  /** The group's id, which its label references. */
  id?: string | undefined;
}
export type SelectItemGroupProps = Assign<HTMLProps<'div'>, SelectItemGroupBaseProps>;

/** Render the Select item group. */
export const SelectItemGroup = (props: SelectItemGroupProps) => {
  const [_itemGroupProps, localProps] = createSplitProps<Pick<SelectItemGroupBaseProps, 'id'>>()(
    props,
    ['id'],
  );
  const select = useSelectContext();
  const itemGroupProps = mergeProps({ id: createUniqueId() }, _itemGroupProps);
  const mergedProps = mergeProps(() => select().getItemGroupProps(itemGroupProps), localProps);

  return (
    <SelectItemGroupPropsProvider value={itemGroupProps}>
      <primitive.div {...mergedProps} />
    </SelectItemGroupPropsProvider>
  );
};
