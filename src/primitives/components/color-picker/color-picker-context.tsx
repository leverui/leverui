import { type JSX } from '@solidjs/web';
import { type UseColorPickerContext, useColorPickerContext } from './use-color-picker-context';

export interface ColorPickerContextProps {
  children: (context: UseColorPickerContext) => JSX.Element;
}

/** Render the ColorPicker context context through a function child. */
export const ColorPickerContext = (props: ColorPickerContextProps) =>
  props.children(useColorPickerContext());
