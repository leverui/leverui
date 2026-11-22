import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronDownIcon } from '@lucide/solid';
import { Button, CloseButton, Dialog, Menu, Popover, Portal, Text } from '../../src';
import './dialog-utilities.css';

/** Open a destructive confirmation from a menu item. */
export function DialogOpenFromMenu(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          asChild={
            /** Forward menu activation to the Actions button. */
            (getProps) => (
              <Button {...getProps()} variant="outline">
                Actions <ChevronDownIcon />
              </Button>
            )
          }
        />
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="edit">Edit</Menu.Item>
              <Menu.Item value="duplicate">Duplicate</Menu.Item>
              <Menu.Separator />
              <Menu.Item
                value="delete"
                onClick={
                  /** Open the confirmation after selecting Delete. */
                  () => setOpen(true)
                }
              >
                Delete...
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <Dialog.Root
        role="alertdialog"
        open={open()}
        size="sm"
        onOpenChange={
          /** Keep the dialog controlled through its close actions. */
          (details) => setOpen(details.open)
        }
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger
                asChild={
                  /** Preserve close behavior on the CloseButton. */
                  (getProps) => <CloseButton {...getProps()} size="md" />
                }
              />
              <Dialog.Header>
                <Dialog.Title>Confirm delete</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to delete this item? This action cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={
                    /** Cancel the pending deletion. */
                    () => setOpen(false)
                  }
                >
                  Cancel
                </Button>
                <Button colorPalette="red">Delete</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

/** Keep the dialog above the Popover that launched it. */
export function DialogOpenFromPopover(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        asChild={
          /** Preserve the popover trigger on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline">
              Open popover
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title class="example-dialog-popover-title">
                Dialog in a popover
              </Popover.Title>
              <Text class="example-dialog-popover-text">
                The button below opens a dialog. The dialog appears above this popover.
              </Text>
              <Dialog.Root>
                <Dialog.Trigger
                  asChild={
                    /** Open the nested dialog from the blue popover button. */
                    (getProps) => (
                      <Button {...getProps()} size="sm" variant="solid" colorPalette="blue">
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
                          /** Preserve close behavior on the CloseButton. */
                          (getProps) => <CloseButton {...getProps()} size="md" />
                        }
                      />
                      <Dialog.Header>
                        <Dialog.Title>Dialog from a popover</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text>
                          This dialog was opened from inside a popover. It appears above the popover
                          because every layer shares one z-index scale.
                        </Text>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger
                          asChild={
                            /** Cancel the dialog without altering the outer popover. */
                            (getProps) => (
                              <Button {...getProps()} variant="outline">
                                Cancel
                              </Button>
                            )
                          }
                        />
                        <Button colorPalette="blue">Save</Button>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
