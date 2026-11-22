import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, HStack, Portal } from '../../src';
import './dialog-utilities.css';

const people = [
  { id: 'alice', name: 'Alice Chen' },
  { id: 'bob', name: 'Bob Okonkwo' },
  { id: 'cara', name: 'Cara Singh' },
] as const;

/** Display the person selected by one of three Dialog triggers. */
export function DialogMultipleTriggers(): JSX.Element {
  return (
    <Dialog.Root>
      <HStack>
        <For each={people}>
          {
            /** Open the shared Dialog with this person's trigger value. */
            (person) => (
              <Dialog.Trigger
                value={person.id}
                asChild={
                  /** Forward trigger behavior to the outline button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline" size="sm">
                      {`Edit ${person.name}`}
                    </Button>
                  )
                }
              />
            )
          }
        </For>
      </HStack>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Context>
              {
                /** Follow the current trigger value without copying it to local state. */
                (store) => {
                  /** Resolve the latest trigger's person without losing reactivity. */
                  const name = () =>
                    people.find(
                      /** Match the person whose trigger opened the Dialog. */
                      (person) => person.id === store().triggerValue,
                    )?.name ?? '';
                  return (
                    <>
                      <Dialog.Header>
                        <Dialog.Title>Edit {name()}</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>This dialog opened from the {name()} trigger.</Dialog.Body>
                    </>
                  );
                }
              }
            </Dialog.Context>
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

/** Expose and close the Dialog through its context. */
export function DialogContext(): JSX.Element {
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
            <Dialog.Context>
              {
                /** Render the current open state and an imperative close control. */
                (store) => (
                  <Dialog.Body class="example-dialog-body-context">
                    <p>Dialog is open: {store().open ? 'true' : 'false'}</p>
                    <p>
                      The line above reads the open state from the dialog context. The button below
                      closes the dialog through the same context.
                    </p>
                    <button
                      onClick={
                        /** Close through the nearest Dialog machine. */
                        () => store().setOpen(false)
                      }
                    >
                      Close
                    </button>
                  </Dialog.Body>
                )
              }
            </Dialog.Context>
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
