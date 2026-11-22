import type { Assign } from '../../types';
import type { IncrementTriggerState } from '@zag-js/number-input';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputIncrementTriggerState = IncrementTriggerState;

export type NumberInputIncrementTriggerBaseProps = PolymorphicProps<
  'button',
  NumberInputIncrementTriggerState
>;
export type NumberInputIncrementTriggerProps = Assign<
  HTMLProps<'button'>,
  NumberInputIncrementTriggerBaseProps
>;

/** Render the NumberInput increment trigger. */
export const NumberInputIncrementTrigger = (props: NumberInputIncrementTriggerProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getIncrementTriggerProps(), props);

  return <primitive.button {...mergedProps} state={api().getIncrementTriggerState()} />;
};
