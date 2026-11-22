import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { SquarePlusIcon, TrashIcon } from '@lucide/solid';
import { ActionBar, Button, Checkbox, Dialog } from '../../src';

/** Open a confirmation dialog from a selection Action Bar. */
export function ActionBarWithDialog(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  return (
    <>
      <Checkbox.Root
        onCheckedChange={
          /** Keep the Action Bar open while its checkbox is checked. */
          (details) => setChecked(details.checked === true)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Check to select projects</Checkbox.Label>
      </Checkbox.Root>
      <ActionBar.Root open={checked()}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content aria-label="Selection actions">
              <ActionBar.SelectionTrigger>4 selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                <SquarePlusIcon /> Add to collection
              </Button>
              <Dialog.Root placement="center">
                <Dialog.Trigger
                  asChild={
                    /** Forward the dialog trigger's behavior to the action button. */
                    (getProps) => (
                      <Button {...getProps()} variant="surface" colorPalette="red" size="sm">
                        <TrashIcon /> Delete projects
                      </Button>
                    )
                  }
                />
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>Delete projects</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Dialog.Description>
                          Are you sure you want to delete 4 projects?
                        </Dialog.Description>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Button variant="outline">Cancel</Button>
                        <Button colorPalette="red">Delete</Button>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}
