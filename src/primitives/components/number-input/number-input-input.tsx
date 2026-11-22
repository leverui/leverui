import type { Assign } from '../../types';
import type { InputState } from '@zag-js/number-input';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputInputState = InputState;

export type NumberInputInputBaseProps = PolymorphicProps<'input', NumberInputInputState>;
export type NumberInputInputProps = Assign<HTMLProps<'input'>, NumberInputInputBaseProps>;

/** Render the NumberInput input. */
export const NumberInputInput = (props: NumberInputInputProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getInputProps(), props);
  const field = useFieldContext();

  return (
    <primitive.input
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={api().getInputState()}
    />
  );
};
