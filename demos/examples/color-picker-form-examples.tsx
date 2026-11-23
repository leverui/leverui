import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, ColorPicker, Dialog, HStack, Portal, Stack } from '../../src';

/** Validate a Solid-owned color form while retaining native submission. */
export function ColorPickerHookForm(): JSX.Element {
  const [color, setColor] = createSignal('#000000');

  /** Mirror picker changes into the form's string value. */
  function updateColor(details: ColorPicker.ValueChangeDetails): void {
    setColor(details.valueAsString);
  }

  /** Submit the selected color through a native form. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    console.log({ color: color() });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
        <ColorPicker.Root
          name="color"
          defaultValue={ColorPicker.parseColor('#000000')}
          onValueChange={updateColor}
        >
          <ColorPicker.HiddenInput />
          <ColorPicker.Control>
            <ColorPicker.Input />
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="sm" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}

/** Place the full picker inside a dialog's focus scope. */
export function ColorPickerOpenFromDialog(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Pass modal activation to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger
              asChild={
                /** Keep the native close control inside the dialog. */
                (getProps) => <CloseButton {...getProps()} />
              }
            />
            <Dialog.Header>
              <Dialog.Title>Pick a color</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <ColorPicker.Root
                defaultValue={ColorPicker.parseColor('#eb5e41')}
                class="color-picker-example-compact"
              >
                <ColorPicker.HiddenInput />
                <ColorPicker.Label>Color</ColorPicker.Label>
                <ColorPicker.Control>
                  <ColorPicker.Input />
                  <ColorPicker.Trigger />
                </ColorPicker.Control>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </ColorPicker.Root>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
