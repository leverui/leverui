import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerPositionerBaseProps = PolymorphicProps<'div'>;
export type DatePickerPositionerProps = Assign<HTMLProps<'div'>, DatePickerPositionerBaseProps>;

/** Render the DatePicker positioner. */
export const DatePickerPositioner = (props: DatePickerPositionerProps) => {
  const api = useDatePickerContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
