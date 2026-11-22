import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { createMemo, Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { listboxAnatomy } from './listbox.anatomy';
import { useListboxContext } from './use-listbox-context';

const parts = listboxAnatomy.build();

export type ListboxEmptyBaseProps = PolymorphicProps<'div'>;
export type ListboxEmptyProps = Assign<HTMLProps<'div'>, ListboxEmptyBaseProps>;

/** Render the Listbox empty. */
export const ListboxEmpty = (props: ListboxEmptyProps) => {
  const [localProps, restProps] = splitProps(props, ['children']);
  const listbox = useListboxContext();
  const isEmpty = createMemo(() => listbox().collection.size === 0);

  // the element stays mounted so the live region is already known to screen
  // readers when the message appears; only the children are conditional
  return (
    <primitive.div
      {...parts.empty.attrs('')}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      {...restProps}
    >
      <Show when={isEmpty()}>{localProps.children}</Show>
    </primitive.div>
  );
};
