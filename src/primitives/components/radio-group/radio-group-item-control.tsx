import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context';

export type RadioGroupItemControlBaseProps = PolymorphicProps<'span'>;
export type RadioGroupItemControlProps = Assign<HTMLProps<'span'>, RadioGroupItemControlBaseProps>;

/** Render the RadioGroup item control. */
export const RadioGroupItemControl = (props: RadioGroupItemControlProps) => {
  const radioGroup = useRadioGroupContext();
  const itemProps = useRadioGroupItemPropsContext();
  const mergedProps = mergeProps(() => radioGroup().getItemControlProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
