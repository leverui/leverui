import { type JSX } from '@solidjs/web';
import { Volume2Icon, VolumeXIcon, XIcon } from '@lucide/solid';
import { Button, Toggle } from '../../src';

/** Swap both glyph and label according to the pressed state. */
export function ToggleWithIndicator(): JSX.Element {
  return (
    <Toggle.Root
      asChild={
        /** Render the machine's fallback and pressed indicators inside one button. */
        (getProps) => (
          <Button {...getProps({ class: 'toggle-example-solid-when-pressed' })} variant="outline">
            <Toggle.Indicator fallback={<Volume2Icon />}>
              <VolumeXIcon />
            </Toggle.Indicator>
            <Toggle.Indicator fallback="Mute">Unmute</Toggle.Indicator>
          </Button>
        )
      }
    />
  );
}

/** Start pressed with a red solid button and conditional close glyph. */
export function ToggleWithPressedIcon(): JSX.Element {
  return (
    <Toggle.Root
      defaultPressed
      asChild={
        /** Keep variant and palette state on the consumer Button. */
        (getProps) => (
          <Button
            {...getProps({ class: 'toggle-example-solid-when-pressed toggle-example-red' })}
            variant="outline"
            colorPalette="gray"
          >
            <Toggle.Indicator>
              <XIcon />
            </Toggle.Indicator>
            Declined
          </Button>
        )
      }
    />
  );
}
