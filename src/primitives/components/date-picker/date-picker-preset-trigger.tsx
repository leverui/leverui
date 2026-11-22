import type { PresetTriggerProps } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerPresetTriggerBaseProps = PresetTriggerProps & PolymorphicProps<'button'>;
export type DatePickerPresetTriggerProps = Assign<
  HTMLProps<'button'>,
  DatePickerPresetTriggerBaseProps
>;

/** Render the DatePicker preset trigger. */
export const DatePickerPresetTrigger = (props: DatePickerPresetTriggerProps) => {
  const [presetTriggerProps, localProps] = createSplitProps<PresetTriggerProps>()(props, ['value']);
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getPresetTriggerProps(presetTriggerProps), localProps);

  return <primitive.button {...mergedProps} />;
};
