import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';

export type RadioGroupIndicatorBaseProps = PolymorphicProps<'div'>;
export type RadioGroupIndicatorProps = Assign<HTMLProps<'div'>, RadioGroupIndicatorBaseProps>;

/** Render the RadioGroup indicator. */
export const RadioGroupIndicator = (props: RadioGroupIndicatorProps) => {
  const radioGroup = useRadioGroupContext();
  const mergedProps = mergeProps(() => radioGroup().getIndicatorProps(), props);

  return <primitive.div {...mergedProps} />;
};
