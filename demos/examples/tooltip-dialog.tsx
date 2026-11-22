import { type JSX } from '@solidjs/web';
import { Button, CloseButton, Dialog, Portal, Tooltip } from '../../src';

/** Place a Tooltip on the same button that opens the dialog. */
export function TooltipWithDialog(): JSX.Element {
  return (
    <Dialog.Root ids={{ trigger: 'd-1' }}>
      <Tooltip content="Change your name and email" ids={{ trigger: 't-1' }}>
        {
          /** Compose Tooltip and Dialog trigger props on one button. */
          (tooltipProps) => (
            <Dialog.Trigger
              {...tooltipProps()}
              asChild={
                /** Preserve both trigger machines on the native button. */
                (dialogProps) => (
                  <Button {...dialogProps()} variant="outline" size="sm">
                    Edit profile
                  </Button>
                )
              }
            />
          )
        }
      </Tooltip>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit your profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Update your display name and the email address where we send your receipts. Your
                changes take effect as soon as you save.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger
              asChild={
                /** Keep close semantics on the compact icon button. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
