import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createUniqueId } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';
import { ComboboxItemGroupPropsProvider } from './use-combobox-item-group-props-context';

export interface ComboboxItemGroupBaseProps extends PolymorphicProps<'div'> {
  /** The group's id, which its label references. */
  id?: string | undefined;
}
export type ComboboxItemGroupProps = Assign<HTMLProps<'div'>, ComboboxItemGroupBaseProps>;

/** Render the Combobox item group. */
export const ComboboxItemGroup = (props: ComboboxItemGroupProps) => {
  const [_itemGroupProps, localProps] = createSplitProps<Pick<ComboboxItemGroupBaseProps, 'id'>>()(
    props,
    ['id'],
  );
  const combobox = useComboboxContext();
  const itemGroupProps = mergeProps({ id: createUniqueId() }, _itemGroupProps);
  const mergedProps = mergeProps(() => combobox().getItemGroupProps(itemGroupProps), localProps);

  return (
    <ComboboxItemGroupPropsProvider value={itemGroupProps}>
      <primitive.div {...mergedProps} />
    </ComboboxItemGroupPropsProvider>
  );
};
