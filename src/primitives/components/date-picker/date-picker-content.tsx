import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerContentState = ContentState;

export type DatePickerContentBaseProps = PolymorphicProps<'div', DatePickerContentState>;
export type DatePickerContentProps = Assign<HTMLProps<'div'>, DatePickerContentBaseProps>;

/** Render the DatePicker content. */
export const DatePickerContent = (props: DatePickerContentProps) => {
  const api = useDatePickerContext();
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
