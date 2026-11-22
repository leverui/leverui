import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputLabelBaseProps = PolymorphicProps<'label'>;
export type NumberInputLabelProps = Assign<HTMLProps<'label'>, NumberInputLabelBaseProps>;

/** Render the NumberInput label. */
export const NumberInputLabel = (props: NumberInputLabelProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
