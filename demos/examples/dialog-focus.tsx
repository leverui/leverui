import { type JSX } from '@solidjs/web';
import { Box, Button, CloseButton, Dialog, Field, Input, Portal, Stack } from '../../src';
import './dialog-utilities.css';
import './dialog-focus.css';

/** Return focus to the dashed content box after the Dialog closes. */
export function DialogFinalFocus(): JSX.Element {
  let finalElement: HTMLDivElement | undefined;
  return (
    <Stack align="start">
      <Dialog.Root
        finalFocusEl={
          /** Give the Dialog the mounted final focus target. */
          () => finalElement ?? null
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
                <p>
                  Anyone you invite to this project can open its files and leave comments. Editors
                  can also add, rename, and delete files. You can change a person's role at any time
                  from the members list. When you remove someone, they lose access right away, but
                  their comments stay. Files you delete go to the trash and stay there for 30 days.
                  After that they are removed for good and cannot be restored. Each file keeps a
                  history of changes, so you can go back to an earlier version. Contact support if
                  you need help with your plan.
                </p>
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
      <Box
        class="dialog-final-focus-target"
        ref={finalElement}
        tabindex={-1}
        aria-label="Focus moved to this box"
      >
        This box receives focus when the dialog closes.
      </Box>
    </Stack>
  );
}

/** Select the second form input as the Dialog's initial focus target. */
export function DialogInitialFocus(): JSX.Element {
  let focusedInput: HTMLInputElement | undefined;
  return (
    <Dialog.Root
      initialFocusEl={
        /** Give the Dialog the live second input for initial focus. */
        () => focusedInput ?? null
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
              <Dialog.Title>Edit your name</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body style={{ 'padding-bottom': 'var(--leverui-spacing-4)' }}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>First name</Field.Label>
                  <Input placeholder="First name" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Last name</Field.Label>
                  <Input ref={focusedInput} placeholder="This field gets focus first" />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild={
                  /** Close the form with its outlined Cancel button. */
                  (getProps) => (
                    <Button {...getProps()} variant="outline">
                      Cancel
                    </Button>
                  )
                }
              />
              <Button>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
