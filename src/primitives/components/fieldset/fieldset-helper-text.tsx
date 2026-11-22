import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldsetContext } from './use-fieldset-context';

export type FieldsetHelperTextBaseProps = PolymorphicProps<'span'>;
export type FieldsetHelperTextProps = Assign<HTMLProps<'span'>, FieldsetHelperTextBaseProps>;

/** Render the Fieldset helper text. */
export const FieldsetHelperText = (props: FieldsetHelperTextProps) => {
  const fieldset = useFieldsetContext();
  const mergedProps = mergeProps(() => fieldset().getHelperTextProps(), props);

  return <primitive.span {...mergedProps} />;
};
