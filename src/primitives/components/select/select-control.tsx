import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectControlBaseProps = PolymorphicProps<'div'>;
export type SelectControlProps = Assign<HTMLProps<'div'>, SelectControlBaseProps>;

/** Render the Select control. */
export const SelectControl = (props: SelectControlProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
