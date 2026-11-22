import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { children } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';

export interface ListboxValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string;
}
export type ListboxValueTextProps = Assign<HTMLProps<'span'>, ListboxValueTextBaseProps>;

/** Render the Listbox value text. */
export const ListboxValueText = (props: ListboxValueTextProps) => {
  const { placeholder, ...localprops } = props;
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getValueTextProps(), localprops);
  const resolved = children(() => props.children);

  return (
    <primitive.span {...mergedProps}>
      {resolved() || listbox().valueAsString || placeholder}
    </primitive.span>
  );
};
