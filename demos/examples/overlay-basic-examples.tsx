import { type JSX } from '@solidjs/web';
import { Box, Button, createOverlay } from '../../src';
import { OverlayDialog, type OverlayDialogData } from './overlay-dialog';

const basic = createOverlay<OverlayDialogData>(OverlayDialog);

/** Open a basic dialog from an imperative overlay controller. */
export function OverlayBasic(): JSX.Element {
  /** Open the title and description. */
  function openDialog(): void {
    void basic.open('a', {
      title: 'Welcome back',
      description: 'You have three new messages since your last visit.',
    });
  }
  return (
    <>
      <Button onClick={openDialog}>Open dialog</Button>
      <basic.Viewport />
    </>
  );
}

const changing = createOverlay<OverlayDialogData>(OverlayDialog);

/** Replace a mounted dialog's content after the delay. */
export function OverlayUpdate(): JSX.Element {
  /** Update both title and body after two seconds. */
  function updateDialog(): void {
    changing.update('a', {
      title: 'You are up to date',
      content:
        /** Create styled Solid content under the viewport's provider. */
        () => (
          <Box
            textStyle="sm"
            style={{
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            Version 2.4 is installed. There is nothing to download.
          </Box>
        ),
    });
  }
  /** Open the initial content and schedule its replacement. */
  function openDialog(): void {
    void changing.open('a', {
      title: 'Checking for updates',
      content:
        /** Create initial styled content in the mounted dialog owner. */
        () => <Box textStyle="sm">This text will change in 2 seconds.</Box>,
    });
    setTimeout(updateDialog, 2000);
  }
  return (
    <>
      <Button onClick={openDialog}>Open dialog</Button>
      <changing.Viewport />
    </>
  );
}

interface DialogResult {
  message: string;
}

const returning = createOverlay<OverlayDialogData, DialogResult>(OverlayDialog);

/** Open a second dialog using the return value from the first. */
export function OverlayReturnValue(): JSX.Element {
  /** Close the first dialog with its message. */
  function closeFirst(): void {
    void returning.close('a', { message: 'Welcome' });
  }
  /** Wait for the first dialog's exit before opening the next. */
  async function openDialog(): Promise<void> {
    const result = await returning.open('a', {
      title: 'Before you start',
      description: 'Close this dialog to open the next one.',
      content:
        /** Render the close action inside the dialog's provider scope. */
        () => <Button onClick={closeFirst}>Close</Button>,
    });
    await returning.waitForExit('a');
    if (!result) return;
    void returning.open('b', {
      title: result.message,
      description: 'The first dialog passed this title along when it closed.',
    });
  }
  return (
    <>
      <Button onClick={openDialog}>Open dialog</Button>
      <returning.Viewport />
    </>
  );
}
