import type { Assign } from '../../types';
import type { ScrollArrowProps } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectScrollArrowBaseProps = ScrollArrowProps & PolymorphicProps<'div'>;
export type SelectScrollArrowProps = Assign<HTMLProps<'div'>, SelectScrollArrowBaseProps>;

/** Render the Select scroll arrow. */
export const SelectScrollArrow = (props: SelectScrollArrowProps) => {
  const [scrollArrowProps, localProps] = createSplitProps<ScrollArrowProps>()(props, ['placement']);
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getScrollArrowProps(scrollArrowProps), localProps);

  return <primitive.div {...mergedProps} />;
};
