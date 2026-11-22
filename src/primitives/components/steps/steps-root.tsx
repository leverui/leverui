import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseStepsProps, useSteps } from './use-steps';
import { StepsProvider } from './use-steps-context';

export type StepsRootBaseProps = UseStepsProps & PolymorphicProps<'div'>;
export type StepsRootProps = Assign<HTMLProps<'div'>, StepsRootBaseProps>;

/** Render the Steps root. */
export const StepsRoot = (props: StepsRootProps) => {
  const [useStepsProps, localProps] = createSplitProps<UseStepsProps>()(props, [
    'completedValues',
    'defaultCompletedValues',
    'defaultValue',
    'id',
    'ids',
    'items',
    'linear',
    'onComplete',
    'onCompletedChange',
    'onNavigationBlocked',
    'onValueChange',
    'orientation',
    'translations',
    'value',
  ]);

  const steps = useSteps(useStepsProps);
  const mergedProps = mergeProps(() => steps().getRootProps(), localProps);

  return (
    <StepsProvider value={steps}>
      <primitive.div {...mergedProps} />
    </StepsProvider>
  );
};
