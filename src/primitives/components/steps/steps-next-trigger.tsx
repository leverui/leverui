import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsNextTriggerBaseProps = PolymorphicProps<'button'>;
export type StepsNextTriggerProps = Assign<HTMLProps<'button'>, StepsNextTriggerBaseProps>;

/** Render the Steps next trigger. */
export const StepsNextTrigger = (props: StepsNextTriggerProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getNextTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
