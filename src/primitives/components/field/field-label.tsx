import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export type FieldLabelBaseProps = PolymorphicProps<'label'>;
export type FieldLabelProps = Assign<HTMLProps<'label'>, FieldLabelBaseProps>;

/** Render the Field label. */
export const FieldLabel = (props: FieldLabelProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field?.().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
