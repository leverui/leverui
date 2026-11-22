import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context';

export type RadioGroupItemHiddenInputBaseProps = PolymorphicProps<'input'>;
export type RadioGroupItemHiddenInputProps = Assign<
  HTMLProps<'input'>,
  RadioGroupItemHiddenInputBaseProps
>;

/** Render the RadioGroup item hidden input. */
export const RadioGroupItemHiddenInput = (props: RadioGroupItemHiddenInputProps) => {
  const radioGroup = useRadioGroupContext();
  const itemProps = useRadioGroupItemPropsContext();
  const mergedProps = mergeProps(() => radioGroup().getItemHiddenInputProps(itemProps), props);

  return <primitive.input {...mergedProps} />;
};
