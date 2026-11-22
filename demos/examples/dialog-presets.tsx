import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Portal } from '../../src';
import './dialog-utilities.css';

/** Fill the viewport while sliding the content from below. */
export function DialogFullscreen(): JSX.Element {
  return (
    <Dialog.Root size="full" motionPreset="slide-in-bottom">
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

/** Use full size on small screens and large size from md upward. */
export function DialogResponsiveSize(): JSX.Element {
  return (
    <Dialog.Root size={{ mdDown: 'full', md: 'lg' }}>
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

/** Slide the panel in from the bottom edge of the viewport. */
export function DialogMotionPreset(): JSX.Element {
  return (
    <Dialog.Root motionPreset="slide-in-bottom">
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Slide in from bottom
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
