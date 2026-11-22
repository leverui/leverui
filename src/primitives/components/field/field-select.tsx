import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from './use-field-context';

export type FieldSelectBaseProps = PolymorphicProps<'select'>;
export type FieldSelectProps = Assign<HTMLProps<'select'>, FieldSelectBaseProps>;

/** Render the Field select. */
export const FieldSelect = (props: FieldSelectProps) => {
  const field = useFieldContext();
  const mergedProps = mergeProps(() => field?.().getSelectProps(), props);

  return <primitive.select {...mergedProps} />;
};
