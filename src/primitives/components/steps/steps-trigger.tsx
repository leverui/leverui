import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';
import { useStepsItemPropsContext } from './use-steps-item-props-context';

export type StepsTriggerBaseProps = PolymorphicProps<'button'>;
export type StepsTriggerProps = Assign<HTMLProps<'button'>, StepsTriggerBaseProps>;

/** Render the Steps trigger. */
export const StepsTrigger = (props: StepsTriggerProps) => {
  const steps = useStepsContext();
  const itemProps = useStepsItemPropsContext();
  const mergedProps = mergeProps(() => steps().getTriggerProps(itemProps), props);

  return <primitive.button {...mergedProps} />;
};
