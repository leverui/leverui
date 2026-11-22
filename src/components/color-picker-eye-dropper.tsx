import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useColorPickerContext } from './color-picker-machine';
import { ColorPickerPipetteIcon } from './color-picker-pipette-icon';
import { IconButton, type IconButtonProps } from './icon-button';
import { mergeRecipeProps } from './recipe-props-merge';

export type ColorPickerEyeDropperProps = IconButtonProps;
type ClickProps = Pick<IconButtonProps, 'onClick'>;

/** Render an icon button wired to Zag's EyeDropper behavior. */
export function ColorPickerEyeDropper(props: ColorPickerEyeDropperProps): JSX.Element {
  const picker = useColorPickerContext();
  const [content, click, rest] = splitProps(props, ['children'], ['onClick']);
  const clickProps = mergeRecipeProps<ClickProps>(
    /** Compose Zag's action before the consumer's native click callback. */
    () => ({ onClick: picker().getEyeDropperTriggerProps().onClick }),
    click,
  );
  const triggerProps = createMemo(
    /** Keep the caller's button ref while following machine interaction props. */
    () => {
      const {
        ref: machineRef,
        onClick: machineClick,
        ...machineProps
      } = picker().getEyeDropperTriggerProps();
      void machineRef;
      void machineClick;
      return machineProps;
    },
  );
  return (
    <IconButton {...triggerProps()} {...rest} onClick={clickProps.onClick}>
      {content.children === undefined ? <ColorPickerPipetteIcon /> : content.children}
    </IconButton>
  );
}
