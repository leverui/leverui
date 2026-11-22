import type { Assign } from '../../types';
import type { RootState } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseColorPickerReturn } from './use-color-picker';
import { ColorPickerProvider } from './use-color-picker-context';

interface RootProviderProps {
  value: UseColorPickerReturn;
}

export type ColorPickerRootProviderState = RootState;

export type ColorPickerRootProviderBaseProps = RootProviderProps &
  UsePresenceProps &
  PolymorphicProps<'div', ColorPickerRootProviderState>;
export type ColorPickerRootProviderProps = Assign<
  HTMLProps<'div'>,
  ColorPickerRootProviderBaseProps
>;

/** Provide the ColorPicker root provider to its children. */
export const ColorPickerRootProvider = (props: ColorPickerRootProviderProps) => {
  const [presenceProps, colorPickerProps] = splitPresenceProps(props);
  const [{ value: colorPicker }, localProps] = createSplitProps<RootProviderProps>()(
    colorPickerProps,
    ['value'],
  );
  const apiPresence = usePresence(
    mergeProps(presenceProps, () => ({ present: colorPicker().open })),
  );
  const mergedProps = mergeProps(() => colorPicker().getRootProps(), localProps);

  return (
    <ColorPickerProvider value={colorPicker}>
      <PresenceProvider value={apiPresence}>
        <primitive.div {...mergedProps} state={colorPicker().getRootState()} />
      </PresenceProvider>
    </ColorPickerProvider>
  );
};
