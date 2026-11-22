import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';
import { useStepsItemPropsContext } from './use-steps-item-props-context';

export type StepsSeparatorBaseProps = PolymorphicProps<'div'>;
export type StepsSeparatorProps = Assign<HTMLProps<'div'>, StepsSeparatorBaseProps>;

/** Render the Steps separator. */
export const StepsSeparator = (props: StepsSeparatorProps) => {
  const steps = useStepsContext();
  const itemProps = useStepsItemPropsContext();
  const mergedProps = mergeProps(() => steps().getSeparatorProps(itemProps), props);

  return <primitive.div {...mergedProps} />;
};
