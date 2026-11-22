import { Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Portal } from '../../src';
import './dialog-utilities.css';

/** Keep long content inside the smaller scrollable panel. */
export function DialogInsideScroll(): JSX.Element {
  return (
    <Dialog.Root scrollBehavior="inside" size="sm">
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Inside scroll
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>With inside scroll</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Repeat count={8}>
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

/** Let the positioner scroll around the long panel. */
export function DialogOutsideScroll(): JSX.Element {
  return (
    <Dialog.Root size="sm" scrollBehavior="outside">
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Outside scroll
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>With outside scroll</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Repeat count={8}>
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
