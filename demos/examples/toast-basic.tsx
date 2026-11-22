import { type JSX } from '@solidjs/web';
import { Button, toaster } from '../../src';

/** Show the default informational file-save toast. */
export function ToastBasic(): JSX.Element {
  /** Publish the notification. */
  function showToast(): void {
    toaster.create({ description: 'File saved successfully', type: 'info' });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}

/** Include the optional close control. */
export function ToastClosable(): JSX.Element {
  /** Publish the closable notification. */
  function showToast(): void {
    toaster.create({ description: 'File saved successfully', type: 'info', closable: true });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}

/** Keep a loading notification visible until the caller updates it. */
export function ToastPersistent(): JSX.Element {
  /** Publish the persistent notification. */
  function showToast(): void {
    toaster.create({ description: 'Saving your file...', type: 'loading' });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}

/** Override the ordinary toast lifetime with six seconds. */
export function ToastDuration(): JSX.Element {
  /** Publish the six-second notification. */
  function showToast(): void {
    toaster.create({ description: 'File saved successfully', duration: 6000 });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}
