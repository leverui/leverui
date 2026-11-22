import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';
import { useListboxItemGroupPropsContext } from './use-listbox-item-group-props-context';

export type ListboxItemGroupLabelBaseProps = PolymorphicProps<'div'>;
export type ListboxItemGroupLabelProps = Assign<HTMLProps<'div'>, ListboxItemGroupLabelBaseProps>;

/** Render the Listbox item group label. */
export const ListboxItemGroupLabel = (props: ListboxItemGroupLabelProps) => {
  const listbox = useListboxContext();
  const itemGroupProps = useListboxItemGroupPropsContext();
  const mergedProps = mergeProps(
    () => listbox().getItemGroupLabelProps({ htmlFor: itemGroupProps.id }),
    props,
  );

  return <primitive.div {...mergedProps} />;
};
