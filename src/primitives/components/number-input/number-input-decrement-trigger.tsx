import type { Assign } from '../../types';
import type { DecrementTriggerState } from '@zag-js/number-input';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useNumberInputContext } from './use-number-input-context';

export type NumberInputDecrementTriggerState = DecrementTriggerState;

export type NumberInputDecrementTriggerBaseProps = PolymorphicProps<
  'button',
  NumberInputDecrementTriggerState
>;
export type NumberInputDecrementTriggerProps = Assign<
  HTMLProps<'button'>,
  NumberInputDecrementTriggerBaseProps
>;

/** Render the NumberInput decrement trigger. */
export const NumberInputDecrementTrigger = (props: NumberInputDecrementTriggerProps) => {
  const api = useNumberInputContext();
  const mergedProps = mergeProps(() => api().getDecrementTriggerProps(), props);

  return <primitive.button {...mergedProps} state={api().getDecrementTriggerState()} />;
};
