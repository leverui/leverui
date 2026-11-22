import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsSkipTriggerBaseProps = PolymorphicProps<'button'>;
export type StepsSkipTriggerProps = Assign<HTMLProps<'button'>, StepsSkipTriggerBaseProps>;

/** Render the Steps skip trigger. */
export const StepsSkipTrigger = (props: StepsSkipTriggerProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getSkipTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
