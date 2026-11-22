import type { Assign } from '../../types';
import type { InputProps, InputState } from '@zag-js/pin-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePinInputContext } from './use-pin-input-context';

export type PinInputInputState = InputState;

export type PinInputInputBaseProps = InputProps & PolymorphicProps<'input', PinInputInputState>;
export type PinInputInputProps = Assign<HTMLProps<'input'>, PinInputInputBaseProps>;

/** Render the PinInput input. */
export const PinInputInput = (props: PinInputInputProps) => {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index']);
  const api = usePinInputContext();
  const mergedProps = mergeProps(() => api().getInputProps(inputProps), localProps);

  return <primitive.input {...mergedProps} state={api().getInputState(inputProps)} />;
};
