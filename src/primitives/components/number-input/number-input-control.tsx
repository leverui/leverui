import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputControlBaseProps = PolymorphicProps<'div'>;
export type NumberInputControlProps = Assign<HTMLProps<'div'>, NumberInputControlBaseProps>;

/** Render the NumberInput control. */
export const NumberInputControl = (props: NumberInputControlProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
