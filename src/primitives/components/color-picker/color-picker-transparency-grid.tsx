import type { Assign } from '../../types';
import type { TransparencyGridProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerTransparencyGridBaseProps = TransparencyGridProps & PolymorphicProps<'div'>;
export type ColorPickerTransparencyGridProps = Assign<
  HTMLProps<'div'>,
  ColorPickerTransparencyGridBaseProps
>;

/** Render the ColorPicker transparency grid. */
export const ColorPickerTransparencyGrid = (props: ColorPickerTransparencyGridProps) => {
  const [gridProps, localProps] = createSplitProps<TransparencyGridProps>()(props, ['size']);
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getTransparencyGridProps(gridProps), localProps);

  return <primitive.div {...mergedProps} />;
};
