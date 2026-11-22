import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export type FieldInputBaseProps = PolymorphicProps<'input'>;
export type FieldInputProps = Assign<HTMLProps<'input'>, FieldInputBaseProps>;

/** Render the Field input. */
export const FieldInput = (props: FieldInputProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field?.().getInputProps(), props);

  return <primitive.input {...mergedProps} />;
};
