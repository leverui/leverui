import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerContentState = ContentState;

export type ColorPickerContentBaseProps = PolymorphicProps<'div', ColorPickerContentState>;
export type ColorPickerContentProps = Assign<HTMLProps<'div'>, ColorPickerContentBaseProps>;

/** Render the ColorPicker content. */
export const ColorPickerContent = (props: ColorPickerContentProps) => {
  const api = useColorPickerContext();
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
