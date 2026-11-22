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
import { type UseColorPickerProps, useColorPicker } from './use-color-picker';
import { ColorPickerProvider } from './use-color-picker-context';

export type ColorPickerRootState = RootState;

export type ColorPickerRootBaseProps = UseColorPickerProps &
  UsePresenceProps &
  PolymorphicProps<'div', ColorPickerRootState>;
export type ColorPickerRootProps = Assign<HTMLProps<'div'>, ColorPickerRootBaseProps>;

/** Render the ColorPicker root. */
export const ColorPickerRoot = (props: ColorPickerRootProps) => {
  const [presenceProps, colorPickerProps] = splitPresenceProps(props);
  const [useColorPickerProps, localProps] = createSplitProps<UseColorPickerProps>()(
    colorPickerProps,
    [
      'closeOnSelect',
      'defaultOpen',
      'defaultValue',
      'defaultFormat',
      'disabled',
      'format',
      'id',
      'ids',
      'initialFocusEl',
      'invalid',
      'name',
      'name',
      'onFocusOutside',
      'onFormatChange',
      'onInteractOutside',
      'onOpenChange',
      'onPointerDownOutside',
      'onValueChange',
      'onValueChangeEnd',
      'open',
      'openAutoFocus',
      'positioning',
      'readOnly',
      'required',
      'inline',
      'locale',
      'value',
    ],
  );
  const api = useColorPicker(useColorPickerProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <ColorPickerProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <primitive.div {...mergedProps} state={api().getRootState()} />
      </PresenceProvider>
    </ColorPickerProvider>
  );
};
