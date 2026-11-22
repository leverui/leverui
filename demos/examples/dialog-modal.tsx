import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Portal } from '../../src';
import './dialog-utilities.css';

/** Leave page interaction available outside the open Dialog. */
export function DialogNonModal(): JSX.Element {
  return (
    <Dialog.Root closeOnInteractOutside={false} modal={false}>
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
        <Dialog.Positioner style={{ 'pointer-events': 'none' }}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Non-modal dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>You can still click and scroll the page behind this dialog while it is open.</p>
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

/** Give destructive confirmation the alertdialog role and red action. */
export function DialogRole(): JSX.Element {
  return (
    <Dialog.Root role="alertdialog">
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
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our systems.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Cancel the destructive action. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button colorPalette="red">Delete</Button>
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

/** Blur content behind a darkened backdrop. */
export function DialogBackdropBlur(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Open dialog (backdrop blur)
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop class="example-dialog-blurred-backdrop" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body class="example-dialog-body-top example-dialog-body-spaced">
              <Dialog.Title>Backdrop blur example</Dialog.Title>
              <Dialog.Description>
                This dialog styles its own backdrop, so the page behind it is blurred.
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.CloseTrigger />
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the blurred example through its footer button. */
                  (getProps) => <Button {...getProps()}>Close</Button>
                }
              />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
