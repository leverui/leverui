import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { usePinInputContext } from './use-pin-input-context';

export type PinInputHiddenInputBaseProps = PolymorphicProps<'input'>;
export type PinInputHiddenInputProps = Assign<HTMLProps<'input'>, PinInputHiddenInputBaseProps>;

/** Render the PinInput hidden input. */
export const PinInputHiddenInput = (props: PinInputHiddenInputProps) => {
  const pinInput = usePinInputContext();
  const mergedProps = mergeProps(() => pinInput().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
