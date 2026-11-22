import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerPositionerBaseProps = PolymorphicProps<'div'>;
export type ColorPickerPositionerProps = Assign<HTMLProps<'div'>, ColorPickerPositionerBaseProps>;

/** Render the ColorPicker positioner. */
export const ColorPickerPositioner = (props: ColorPickerPositionerProps) => {
  const api = useColorPickerContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
