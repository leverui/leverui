import { type JSX } from '@solidjs/web';
import { Button, Dialog, Menu, Portal, createOverlay } from '../../src';
import './dialog-utilities.css';

interface DialogData {
  title: string;
  description?: string;
  content: () => JSX.Element;
}

const dialog = createOverlay<DialogData>(
  /** Render the dialog shell from the props passed to `dialog.open`. */
  (props) => (
    <Dialog.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{props.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body class="example-dialog-body-spaced">
              {props.description && <Dialog.Description>{props.description}</Dialog.Description>}
              {props.content()}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  ),
);

/** Open a dialog from a menu item and render its nested action menu. */
export function OverlayMenuItem(): JSX.Element {
  return (
    <>
      <dialog.Viewport />
      <Menu.Root>
        <Menu.Trigger
          asChild={
            /** Keep trigger behavior on the outline button. */
            (getProps) => (
              <Button {...getProps()} variant="outline" size="sm">
                Menu
              </Button>
            )
          }
        />
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="more"
                onClick={
                  /** Let the menu restore focus before mounting the dialog. */
                  () =>
                    requestAnimationFrame(
                      /** Open the dialog with its nested action menu. */
                      () =>
                        void dialog.open('more', {
                          title: 'Welcome',
                          description: 'Choose an action from the menu below.',
                          /** Create the nested menu under the dialog's owner. */
                          content: () => <ActionsMenu />,
                        }),
                    )
                }
              >
                Show more
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}

/** Render the action menu shown inside the dialog. */
function ActionsMenu(): JSX.Element {
  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              More actions
            </Button>
          )
        }
      />
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="new-txt">New text file</Menu.Item>
          <Menu.Item value="new-file">New file...</Menu.Item>
          <Menu.Item value="new-win">New window</Menu.Item>
          <Menu.Item value="open-file">Open file...</Menu.Item>
          <Menu.Item value="export">Export</Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
