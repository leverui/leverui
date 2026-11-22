import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectListBaseProps = PolymorphicProps<'div'>;
export type SelectListProps = Assign<HTMLProps<'div'>, SelectListBaseProps>;

/** Render the Select list. */
export const SelectList = (props: SelectListProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getListProps(), props);

  return <primitive.div {...mergedProps} />;
};
