import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldsetContext } from './use-fieldset-context';

export type FieldsetLegendBaseProps = PolymorphicProps<'legend'>;
export type FieldsetLegendProps = Assign<HTMLProps<'legend'>, FieldsetLegendBaseProps>;

/** Render the Fieldset legend. */
export const FieldsetLegend = (props: FieldsetLegendProps) => {
  const fieldset = useFieldsetContext();
  const mergedProps = mergeProps(() => fieldset().getLegendProps(), props);

  return <primitive.legend {...mergedProps} />;
};
