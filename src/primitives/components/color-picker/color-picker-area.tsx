import type { Assign } from '../../types';
import type { AreaProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { ColorPickerAreaPropsProvider } from './use-color-picker-area-props-context';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerAreaBaseProps = AreaProps & PolymorphicProps<'div'>;
export type ColorPickerAreaProps = Assign<HTMLProps<'div'>, ColorPickerAreaBaseProps>;

/** Render the ColorPicker area. */
export const ColorPickerArea = (props: ColorPickerAreaProps) => {
  const [channelProps, divprops] = createSplitProps<AreaProps>()(props, ['xChannel', 'yChannel']);
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getAreaProps(channelProps), divprops);

  return (
    <ColorPickerAreaPropsProvider value={channelProps}>
      <primitive.div {...mergedProps} />
    </ColorPickerAreaPropsProvider>
  );
};
