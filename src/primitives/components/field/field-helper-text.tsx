import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export type FieldHelperTextBaseProps = PolymorphicProps<'span'>;
export type FieldHelperTextProps = Assign<HTMLProps<'span'>, FieldHelperTextBaseProps>;

/** Render the Field helper text. */
export const FieldHelperText = (props: FieldHelperTextProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field().getHelperTextProps(), props);

  return <primitive.span {...mergedProps} />;
};
