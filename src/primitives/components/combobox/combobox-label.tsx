import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxLabelBaseProps = PolymorphicProps<'label'>;
export type ComboboxLabelProps = Assign<HTMLProps<'label'>, ComboboxLabelBaseProps>;

/** Render the Combobox label. */
export const ComboboxLabel = (props: ComboboxLabelProps) => {
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
