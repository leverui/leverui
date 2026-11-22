import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsProgressBaseProps = PolymorphicProps<'div'>;
export type StepsProgressProps = Assign<HTMLProps<'div'>, StepsProgressBaseProps>;

/** Render the Steps progress. */
export const StepsProgress = (props: StepsProgressProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getProgressProps(), props);

  return <primitive.div {...mergedProps} />;
};
