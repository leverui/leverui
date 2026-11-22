import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  Dialog,
  Input,
  Menu,
  Portal,
  Stack,
  createOverlay,
  type CreateOverlayProps,
} from '../../src';
import { MenuActionItems, MenuTriggerButton } from './menu-common';
import { OverlayDialog, type OverlayDialogData } from './overlay-dialog';

interface FormData {
  title?: string;
}

/** Render a name form whose submit closes its dialog. */
function FormOverlay(props: FormData & CreateOverlayProps): JSX.Element {
  const [name, setName] = createSignal('');
  /** Keep the form input under Solid state. */
  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setName(event.currentTarget.value);
  }
  /** Display the greeting, close, and reset the form. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    window.alert(`Hello ${name()}!`);
    props.onOpenChange?.({ open: false });
    setName('');
  }
  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {props.title && (
              <Dialog.Header>
                <Dialog.Title>{props.title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body>
              <form onSubmit={submit}>
                <Stack gap="4">
                  <Input value={name()} onInput={updateName} placeholder="Enter your name" />
                  <Button type="submit">Submit</Button>
                </Stack>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const contact = createOverlay<FormData>(FormOverlay);

/** Open the form dialog from its trigger button. */
export function OverlayForm(): JSX.Element {
  /** Mount the name form with its heading. */
  function openForm(): void {
    void contact.open('form', { title: 'Tell us your name' });
  }
  return (
    <>
      <Button onClick={openForm}>Open form</Button>
      <contact.Viewport />
    </>
  );
}

const menuDialog = createOverlay<OverlayDialogData>(OverlayDialog);

/** Open a dialog from a menu item and render its nested action menu. */
export function OverlayMenuItem(): JSX.Element {
  /** Mount the nested action menu inside the dialog owner. */
  function ActionsMenu(): JSX.Element {
    return (
      <Menu.Root>
        <MenuTriggerButton label="More actions" size="sm" />
        <Menu.Positioner>
          <Menu.Content>
            <MenuActionItems />
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  }
  /** Open the dialog after the first menu item activates. */
  function openDialog(): void {
    void menuDialog.open('more', {
      title: 'Welcome',
      description: 'Choose an action from the menu below.',
      content:
        /** Create the nested menu under the dialog's context. */
        () => <ActionsMenu />,
    });
  }
  /** Let the source menu restore focus before mounting the new dialog. */
  function scheduleDialog(): void {
    requestAnimationFrame(openDialog);
  }
  return (
    <>
      <menuDialog.Viewport />
      <Menu.Root>
        <MenuTriggerButton label="Menu" size="sm" />
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="more" onClick={scheduleDialog}>
                Show more
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}
