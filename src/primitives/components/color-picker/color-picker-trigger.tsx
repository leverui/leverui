import type { Assign } from '../../types';
import type { TriggerState } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerTriggerState = TriggerState;

export type ColorPickerTriggerBaseProps = PolymorphicProps<'button', ColorPickerTriggerState>;
export type ColorPickerTriggerProps = Assign<HTMLProps<'button'>, ColorPickerTriggerBaseProps>;

/** Render the ColorPicker trigger. */
export const ColorPickerTrigger = (props: ColorPickerTriggerProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(), props);
  const field = useFieldContext();

  return (
    <primitive.button
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={api().getTriggerState()}
    />
  );
};
