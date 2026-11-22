import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectLabelBaseProps = PolymorphicProps<'label'>;
export type SelectLabelProps = Assign<HTMLProps<'label'>, SelectLabelBaseProps>;

/** Render the Select label. */
export const SelectLabel = (props: SelectLabelProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
