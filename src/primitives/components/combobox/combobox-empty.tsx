import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { createMemo, Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { comboboxAnatomy } from './combobox.anatomy';
import { useComboboxContext } from './use-combobox-context';

const parts = comboboxAnatomy.build();

export type ComboboxEmptyBaseProps = PolymorphicProps<'div'>;
export type ComboboxEmptyProps = Assign<HTMLProps<'div'>, ComboboxEmptyBaseProps>;

/** Render the Combobox empty. */
export const ComboboxEmpty = (props: ComboboxEmptyProps) => {
  const [localProps, restProps] = splitProps(props, ['children']);
  const combobox = useComboboxContext();
  const isEmpty = createMemo(() => combobox().collection.size === 0);

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
