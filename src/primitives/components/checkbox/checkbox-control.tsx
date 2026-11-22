import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCheckboxContext } from './use-checkbox-context';

export type CheckboxControlBaseProps = PolymorphicProps<'span'>;
export type CheckboxControlProps = Assign<HTMLProps<'span'>, CheckboxControlBaseProps>;

/** Render the Checkbox control. */
export const CheckboxControl = (props: CheckboxControlProps) => {
  const checkbox = useCheckboxContext();
  const mergedProps = mergeProps(() => checkbox().getControlProps(), props);

  return <primitive.span {...mergedProps} />;
};
