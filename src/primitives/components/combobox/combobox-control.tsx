import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxControlBaseProps = PolymorphicProps<'div'>;
export type ComboboxControlProps = Assign<HTMLProps<'div'>, ComboboxControlBaseProps>;

/** Render the Combobox control. */
export const ComboboxControl = (props: ComboboxControlProps) => {
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
