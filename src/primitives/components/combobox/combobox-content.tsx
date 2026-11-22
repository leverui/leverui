import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/combobox';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useComboboxContext } from './use-combobox-context';

export type ComboboxContentState = ContentState;

export type ComboboxContentBaseProps = PolymorphicProps<'div', ComboboxContentState>;
export type ComboboxContentProps = Assign<HTMLProps<'div'>, ComboboxContentBaseProps>;

/** Render the Combobox content. */
export const ComboboxContent = (props: ComboboxContentProps) => {
  const api = useComboboxContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  );

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presenceApi().ref,
          () => props.ref,
        )}
        state={api().getContentState()}
      />
    </Show>
  );
};
