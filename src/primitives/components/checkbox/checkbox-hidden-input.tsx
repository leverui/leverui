import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useCheckboxContext } from './use-checkbox-context';

export type CheckboxHiddenInputBaseProps = PolymorphicProps<'input'>;
export type CheckboxHiddenInputProps = Assign<HTMLProps<'input'>, CheckboxHiddenInputBaseProps>;

/** Render the Checkbox hidden input. */
export const CheckboxHiddenInput = (props: CheckboxHiddenInputProps) => {
  const checkbox = useCheckboxContext();
  const mergedProps = mergeProps(() => checkbox().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
