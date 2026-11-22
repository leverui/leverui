import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';
import { useSelectItemPropsContext } from './use-select-item-props-context';

export type SelectItemTextBaseProps = PolymorphicProps<'span'>;
export type SelectItemTextProps = Assign<HTMLProps<'span'>, SelectItemTextBaseProps>;

/** Render the Select item text. */
export const SelectItemText = (props: SelectItemTextProps) => {
  const select = useSelectContext();
  const itemProps = useSelectItemPropsContext();
  const mergedProps = mergeProps(() => select().getItemTextProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
