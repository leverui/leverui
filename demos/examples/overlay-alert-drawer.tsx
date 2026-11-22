import { type JSX } from '@solidjs/web';
import { Button, Dialog, Drawer, Portal, createOverlay, type CreateOverlayProps } from '../../src';
import './dialog-utilities.css';

interface AlertData {
  title?: string;
  content?: string;
  onConfirm?: () => void;
}

/** Render an alert dialog with a cancel action and red confirmation. */
function AlertOverlay(props: AlertData & CreateOverlayProps): JSX.Element {
  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{props.title ?? 'Are you sure?'}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body class="example-dialog-body-spaced">{props.content}</Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the alert while preserving native button behavior. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button colorPalette="red" onClick={props.onConfirm}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const alertOverlay = createOverlay<AlertData>(AlertOverlay);

/** Open the destructive confirmation overlay. */
export function OverlayAlert(): JSX.Element {
  /** Confirm and close the alert dialog. */
  function confirm(): void {
    console.log('confirmed');
    void alertOverlay.close('a');
  }
  /** Show the destructive action copy. */
  function openAlert(): void {
    void alertOverlay.open('a', {
      onConfirm: confirm,
      content: 'Removing this item deletes all of its data. This cannot be undone.',
    });
  }
  return (
    <>
      <Button onClick={openAlert}>Open dialog</Button>
      <alertOverlay.Viewport />
    </>
  );
}

interface DrawerData {
  title: string;
  description?: string;
  placement: 'start' | 'end' | 'top' | 'bottom';
}

/** Render a controlled Drawer using the overlay lifecycle callbacks. */
function DrawerOverlay(props: DrawerData & CreateOverlayProps): JSX.Element {
  return (
    <Drawer.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
      placement={props.placement}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{props.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {props.description && <Drawer.Description>{props.description}</Drawer.Description>}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

const drawerOverlay = createOverlay<DrawerData>(DrawerOverlay);

/** Open the end-placed Drawer through createOverlay. */
export function OverlayDrawer(): JSX.Element {
  /** Mount a Drawer with its title and description. */
  function openDrawer(): void {
    void drawerOverlay.open('a', {
      title: 'Order summary',
      description: 'Two items, shipping on Friday. The total is $48.',
      placement: 'end',
    });
  }
  return (
    <>
      <Button onClick={openDrawer}>Open drawer</Button>
      <drawerOverlay.Viewport />
    </>
  );
}
