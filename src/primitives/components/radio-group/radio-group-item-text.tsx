import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context';

export type RadioGroupItemTextBaseProps = PolymorphicProps<'span'>;
export type RadioGroupItemTextProps = Assign<HTMLProps<'span'>, RadioGroupItemTextBaseProps>;

/** Render the RadioGroup item text. */
export const RadioGroupItemText = (props: RadioGroupItemTextProps) => {
  const radioGroup = useRadioGroupContext();
  const itemProps = useRadioGroupItemPropsContext();
  const mergedProps = mergeProps(() => radioGroup().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
