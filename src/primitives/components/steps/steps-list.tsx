import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsListBaseProps = PolymorphicProps<'div'>;
export type StepsListProps = Assign<HTMLProps<'div'>, StepsListBaseProps>;

/** Render the Steps list. */
export const StepsList = (props: StepsListProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getListProps(), props);

  return <primitive.div {...mergedProps} />;
};
