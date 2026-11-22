import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxInputBaseProps = PolymorphicProps<'input'>;
export type ComboboxInputProps = Assign<HTMLProps<'input'>, ComboboxInputBaseProps>;

/** Render the Combobox input. */
export const ComboboxInput = (props: ComboboxInputProps) => {
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
