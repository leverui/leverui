import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerAreaPropsContext } from './use-color-picker-area-props-context';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerAreaThumbBaseProps = PolymorphicProps<'div'>;
export type ColorPickerAreaThumbProps = Assign<HTMLProps<'div'>, ColorPickerAreaThumbBaseProps>;

/** Render the ColorPicker area thumb. */
export const ColorPickerAreaThumb = (props: ColorPickerAreaThumbProps) => {
  const api = useColorPickerContext();
  const areaProps = useColorPickerAreaPropsContext();
  const mergedProps = mergeProps(() => api().getAreaThumbProps(areaProps), props);

  return <primitive.div {...mergedProps} />;
};
