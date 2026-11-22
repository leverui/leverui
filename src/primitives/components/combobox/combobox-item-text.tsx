import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';
import { useComboboxItemPropsContext } from './use-combobox-item-props-context';

export type ComboboxItemTextBaseProps = PolymorphicProps<'span'>;
export type ComboboxItemTextProps = Assign<HTMLProps<'span'>, ComboboxItemTextBaseProps>;

/** Render the Combobox item text. */
export const ComboboxItemText = (props: ComboboxItemTextProps) => {
  const api = useComboboxContext();
  const itemProps = useComboboxItemPropsContext();
  const mergedProps = mergeProps(() => api().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
