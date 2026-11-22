import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectIndicatorBaseProps = PolymorphicProps<'span'>;
export type SelectIndicatorProps = Assign<HTMLProps<'span'>, SelectIndicatorBaseProps>;

/** Render the Select indicator. */
export const SelectIndicator = (props: SelectIndicatorProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getIndicatorProps(), props);

  return <primitive.span {...mergedProps} />;
};
