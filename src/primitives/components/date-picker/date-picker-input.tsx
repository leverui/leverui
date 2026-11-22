import type { Assign } from '../../types';
import type { InputProps, InputState } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerInputState = InputState;

export type DatePickerInputBaseProps = InputProps & PolymorphicProps<'input', DatePickerInputState>;
export type DatePickerInputProps = Assign<HTMLProps<'input'>, DatePickerInputBaseProps>;

/** Render the DatePicker input. */
export const DatePickerInput = (props: DatePickerInputProps) => {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, ['index', 'fixOnBlur']);
  const datePicker = useDatePickerContext();
  const mergedProps = mergeProps(() => datePicker().getInputProps(inputProps), localProps);

  return <primitive.input {...mergedProps} state={datePicker().getInputState()} />;
};
