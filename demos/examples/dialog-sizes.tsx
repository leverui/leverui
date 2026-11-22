import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, HStack, Portal } from '../../src';
import './dialog-utilities.css';

/** Compare the four trigger and panel sizes. */
export function DialogSizes(): JSX.Element {
  return (
    <HStack>
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Give the current size an independent modal. */
          (size) => (
            <Dialog.Root size={size}>
              <Dialog.Trigger
                asChild={
                  /** Forward trigger behavior to the outline button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size={size}>
                      {`Open (${size})`}
                    </Button>
                  )
                }
              />
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Dialog title</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <p>
                        A short paragraph that says what the dialog is about and what the buttons
                        below do.
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
          )
        }
      </For>
    </HStack>
  );
}

/** Render a trigger for each Dialog placement. */
export function DialogPlacement(): JSX.Element {
  return (
    <HStack wrap="wrap" gap="4">
      <For each={['top', 'center', 'bottom'] as const}>
        {
          /** Keep each placement in its own Dialog machine. */
          (placement) => (
            <Dialog.Root placement={placement} motionPreset="slide-in-bottom">
              <Dialog.Trigger
                asChild={
                  /** Forward trigger behavior to the outline button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size="md">
                      {`Open dialog (${placement}) `}
                    </Button>
                  )
                }
              />
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Dialog title</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <p>
                        A short paragraph that says what the dialog is about and what the buttons
                        below do.
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
          )
        }
      </For>
    </HStack>
  );
}

/** Place the modal in the viewport-cover variant. */
export function DialogCover(): JSX.Element {
  return (
    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
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
              <Dialog.CloseTrigger
                asChild={
                  /** Preserve close behavior on the CloseButton. */
                  (getProps) => <CloseButton {...getProps()} size="sm" />
                }
              />
            </Dialog.Header>
            <Dialog.Body>
              Anyone you invite can view and edit this project. You can change a person's role at
              any time.
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
