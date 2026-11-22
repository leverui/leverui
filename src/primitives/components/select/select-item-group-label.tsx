import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';
import { useSelectItemGroupPropsContext } from './use-select-item-group-props-context';

export type SelectItemGroupLabelBaseProps = PolymorphicProps<'div'>;
export type SelectItemGroupLabelProps = Assign<HTMLProps<'div'>, SelectItemGroupLabelBaseProps>;

/** Render the Select item group label. */
export const SelectItemGroupLabel = (props: SelectItemGroupLabelProps) => {
  const select = useSelectContext();
  const itemGroupProps = useSelectItemGroupPropsContext();
  const mergedProps = mergeProps(
    () => select().getItemGroupLabelProps({ htmlFor: itemGroupProps.id }),
    props,
  );

  return <primitive.div {...mergedProps} />;
};
