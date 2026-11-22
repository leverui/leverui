import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';
import { useComboboxItemGroupPropsContext } from './use-combobox-item-group-props-context';

export type ComboboxItemGroupLabelBaseProps = PolymorphicProps<'div'>;
export type ComboboxItemGroupLabelProps = Assign<HTMLProps<'div'>, ComboboxItemGroupLabelBaseProps>;

/** Render the Combobox item group label. */
export const ComboboxItemGroupLabel = (props: ComboboxItemGroupLabelProps) => {
  const combobox = useComboboxContext();
  const itemGroupProps = useComboboxItemGroupPropsContext();
  const mergedProps = mergeProps(
    () => combobox().getItemGroupLabelProps({ htmlFor: itemGroupProps.id }),
    props,
  );

  return <primitive.div {...mergedProps} />;
};
