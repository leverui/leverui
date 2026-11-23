import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Drawer, Input, Portal, Stack } from '../../src';

/** Focus the email field when the Drawer opens. */
export function DrawerWithInitialFocus(): JSX.Element {
  let emailInput: HTMLInputElement | undefined;
  return (
    <Drawer.Root
      initialFocusEl={
        /** Give the Drawer the mounted email field as its initial focus target. */
        () => emailInput ?? null
      }
    >
      <Drawer.Trigger
        asChild={
          /** Forward trigger behavior to the small outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open drawer
            </Button>
          )
        }
      />
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit profile</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Update your first name and email, then save. The email field is focused when the
                drawer opens.
              </p>
              <Stack style={{ 'margin-top': 'var(--lui-spacing-5)' }}>
                <Input defaultValue="Mara" placeholder="First name" />
                <Input ref={emailInput} placeholder="Email" />
              </Stack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
