import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxListBaseProps = PolymorphicProps<'div'>;
export type ComboboxListProps = Assign<HTMLProps<'div'>, ComboboxListBaseProps>;

/** Render the Combobox list. */
export const ComboboxList = (props: ComboboxListProps) => {
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getListProps(), props);

  return <primitive.div {...mergedProps} />;
};
