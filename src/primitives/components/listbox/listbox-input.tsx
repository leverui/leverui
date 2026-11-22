import type { Assign } from '../../types';
import type { InputProps } from '@zag-js/listbox';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';

export type ListboxInputBaseProps = InputProps & PolymorphicProps<'input'>;
export type ListboxInputProps = Assign<HTMLProps<'input'>, ListboxInputBaseProps>;

/** Render the Listbox input. */
export const ListboxInput = (props: ListboxInputProps) => {
  const [inputProps, localProps] = createSplitProps<InputProps>()(props, [
    'autoHighlight',
    'keyboardPriority',
  ]);
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getInputProps(inputProps), localProps);

  return <primitive.input {...mergedProps} />;
};
