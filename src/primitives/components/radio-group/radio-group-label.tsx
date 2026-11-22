import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';

export type RadioGroupLabelBaseProps = PolymorphicProps<'span'>;
export type RadioGroupLabelProps = Assign<HTMLProps<'span'>, RadioGroupLabelBaseProps>;

/** Render the RadioGroup label. */
export const RadioGroupLabel = (props: RadioGroupLabelProps) => {
  const radioGroup = useRadioGroupContext();
  const mergedProps = mergeProps(() => radioGroup().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
