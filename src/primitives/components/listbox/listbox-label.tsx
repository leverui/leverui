import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';

export type ListboxLabelBaseProps = PolymorphicProps<'span'>;
export type ListboxLabelProps = Assign<HTMLProps<'span'>, ListboxLabelBaseProps>;

/** Render the Listbox label. */
export const ListboxLabel = (props: ListboxLabelProps) => {
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
