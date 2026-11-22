import { type JSX } from '@solidjs/web';
import { Dialog, Portal, type CreateOverlayProps } from '../../src';
import './dialog-utilities.css';

export interface OverlayDialogData {
  title: string;
  description?: string;
  content?: JSX.Element | (() => JSX.Element);
}

/** Render the shared dialog shell from injected overlay props. */
export function OverlayDialog<TReturn>(
  props: OverlayDialogData & CreateOverlayProps<TReturn>,
): JSX.Element {
  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{props.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body class="example-dialog-body-spaced">
              {props.description && <Dialog.Description>{props.description}</Dialog.Description>}
              {typeof props.content === 'function' ? props.content() : props.content}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
