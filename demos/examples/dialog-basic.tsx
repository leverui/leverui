import { createSignal, Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Portal, useDialog } from '../../src';
import './dialog-utilities.css';

/** Open the default Dialog panel. */
export function DialogBasic(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sharing settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Anyone you invite can view and edit this project. You can change a person's role at
                any time.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the Dialog from the outline Cancel button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Keep the lazy-mounted Dialog in a Solid signal. */
export function DialogControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog.Root
      lazyMount
      open={open()}
      onOpenChange={
        /** Synchronize the controlled state with the Dialog's close actions. */
        (details) => setOpen(details.open)
      }
    >
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Open
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sharing settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Repeat count={2}>
                {() => (
                  <p>
                    Anyone you invite to this project can open its files and leave comments. Editors
                    can also add, rename, and delete files. You can change a person's role at any
                    time from the members list. When you remove someone, they lose access right
                    away, but their comments stay. Files you delete go to the trash and stay there
                    for 30 days. After that they are removed for good and cannot be restored. Each
                    file keeps a history of changes, so you can go back to an earlier version.
                    Contact support if you need help with your plan.
                  </p>
                )}
              </Repeat>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the Dialog from the outline Cancel button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Let a caller-owned machine control the rendered Dialog. */
export function DialogStore(): JSX.Element {
  const dialog = useDialog();
  return (
    <Dialog.RootProvider value={dialog}>
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              {`${dialog().open ? 'Close' : 'Open'} dialog`}
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sharing settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Anyone you invite can view and edit this project. You can change a person's role at
                any time.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the Dialog from the outline Cancel button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger
              asChild={
                /** Preserve close behavior on the CloseButton. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
