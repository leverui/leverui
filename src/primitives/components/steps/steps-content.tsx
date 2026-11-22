import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { ItemProps } from '@zag-js/steps';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';

export type StepsContentBaseProps = PolymorphicProps<'div'> & ItemProps;
export type StepsContentProps = Assign<HTMLProps<'div'>, StepsContentBaseProps>;

/** Render the Steps content. */
export const StepsContent = (props: StepsContentProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value']);
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getContentProps(itemProps), localProps);

  return <primitive.div {...mergedProps} />;
};
