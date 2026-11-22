import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxClearTriggerBaseProps = PolymorphicProps<'button'>;
export type ComboboxClearTriggerProps = Assign<HTMLProps<'button'>, ComboboxClearTriggerBaseProps>;

/** Render the Combobox clear trigger. */
export const ComboboxClearTrigger = (props: ComboboxClearTriggerProps) => {
  const combobox = useComboboxContext();
  const mergedProps = mergeProps(() => combobox().getClearTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
