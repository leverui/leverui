import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';
import { useStepsItemPropsContext } from './use-steps-item-props-context';

export type StepsIndicatorBaseProps = PolymorphicProps<'span'>;
export type StepsIndicatorProps = Assign<HTMLProps<'span'>, StepsIndicatorBaseProps>;

/** Render the Steps indicator. */
export const StepsIndicator = (props: StepsIndicatorProps) => {
  const steps = useStepsContext();
  const itemProps = useStepsItemPropsContext();
  const mergedProps = mergeProps(() => steps().getIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
