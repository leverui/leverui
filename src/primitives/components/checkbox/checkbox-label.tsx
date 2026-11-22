import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCheckboxContext } from './use-checkbox-context';

export type CheckboxLabelBaseProps = PolymorphicProps<'span'>;
export type CheckboxLabelProps = Assign<HTMLProps<'span'>, CheckboxLabelBaseProps>;

/** Render the Checkbox label. */
export const CheckboxLabel = (props: CheckboxLabelProps) => {
  const checkbox = useCheckboxContext();
  const mergedProps = mergeProps(() => checkbox().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
