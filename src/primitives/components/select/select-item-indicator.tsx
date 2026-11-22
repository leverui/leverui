import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';
import { useSelectItemPropsContext } from './use-select-item-props-context';

export type SelectItemIndicatorBaseProps = PolymorphicProps<'span'>;
export type SelectItemIndicatorProps = Assign<HTMLProps<'span'>, SelectItemIndicatorBaseProps>;

/** Render the Select item indicator. */
export const SelectItemIndicator = (props: SelectItemIndicatorProps) => {
  const select = useSelectContext();
  const itemProps = useSelectItemPropsContext();
  const mergedProps = mergeProps(() => select().getItemIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
