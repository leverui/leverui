import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsCompletedContentBaseProps = PolymorphicProps<'div'>;
export type StepsCompletedContentProps = Assign<HTMLProps<'div'>, StepsCompletedContentBaseProps>;

/** Render the Steps completed content. */
export const StepsCompletedContent = (props: StepsCompletedContentProps) => {
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getCompletedContentProps(), props);

  return <primitive.div {...mergedProps} />;
};
