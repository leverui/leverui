import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxPositionerBaseProps = PolymorphicProps<'div'>;
export type ComboboxPositionerProps = Assign<HTMLProps<'div'>, ComboboxPositionerBaseProps>;

/** Render the Combobox positioner. */
export const ComboboxPositioner = (props: ComboboxPositionerProps) => {
  const api = useComboboxContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
