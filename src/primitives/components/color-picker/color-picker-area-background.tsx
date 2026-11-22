import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerAreaPropsContext } from './use-color-picker-area-props-context';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerAreaBackgroundBaseProps = PolymorphicProps<'div'>;
export type ColorPickerAreaBackgroundProps = Assign<
  HTMLProps<'div'>,
  ColorPickerAreaBackgroundBaseProps
>;

/** Render the ColorPicker area background. */
export const ColorPickerAreaBackground = (props: ColorPickerAreaBackgroundProps) => {
  const api = useColorPickerContext();
  const areaProps = useColorPickerAreaPropsContext();
  const mergedProps = mergeProps(() => api().getAreaBackgroundProps(areaProps), props);

  return <primitive.div {...mergedProps} />;
};
