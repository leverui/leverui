import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';

export type SelectClearTriggerBaseProps = PolymorphicProps<'button'>;
export type SelectClearTriggerProps = Assign<HTMLProps<'button'>, SelectClearTriggerBaseProps>;

/** Render the Select clear trigger. */
export const SelectClearTrigger = (props: SelectClearTriggerProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getClearTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
