import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsPreviousTriggerBaseProps = PolymorphicProps<'button'>;
export type StepsPreviousTriggerProps = Assign<HTMLProps<'button'>, StepsPreviousTriggerBaseProps>;

/** Render the Steps previous trigger. */
export const StepsPreviousTrigger = (props: StepsPreviousTriggerProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getPreviousTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
