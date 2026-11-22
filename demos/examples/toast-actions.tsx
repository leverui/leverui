import { type JSX } from '@solidjs/web';
import { Button, HStack, toaster } from '../../src';

/** Show a success toast with the Undo action. */
export function ToastAction(): JSX.Element {
  /** Create the action-bearing notification. */
  function showToast(): void {
    toaster.success({
      title: 'File deleted',
      description: 'The file was moved to the trash.',
      action: {
        label: 'Undo',
        /** Mirror the placeholder action. */
        onClick() {
          console.log('Undo');
        },
      },
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}

/** Resolve the upload promise after five seconds. */
export function ToastPromise(): JSX.Element {
  /** Create a pending toast and transition it to success. */
  function showToast(): void {
    const pending = new Promise<void>(
      /** Keep the loading state visible for the delay. */
      (resolve) => {
        window.setTimeout(resolve, 5000);
      },
    );
    toaster.promise(pending, {
      success: { title: 'Upload complete', description: 'Your file is ready to share.' },
      error: { title: 'Upload failed', description: 'Something went wrong. Try again.' },
      loading: { title: 'Uploading...', description: 'This takes a few seconds.' },
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={showToast}>
      Show toast
    </Button>
  );
}

/** Update one persistent loading notification in place. */
export function ToastUpdate(): JSX.Element {
  const id = 'login-error-toast';

  /** Avoid opening a duplicate while the named toast is visible. */
  function showToast(): void {
    if (toaster.isVisible(id)) return;
    toaster.loading({
      id,
      title: 'Connecting...',
      description: 'Checking your access to this project.',
    });
  }

  /** Replace the loading copy and lifetime without changing its ID. */
  function updateToast(): void {
    toaster.update(id, {
      title: 'Connected',
      description: 'You now have access to this project.',
      type: 'success',
      duration: 3000,
    });
  }

  return (
    <HStack>
      <Button variant="outline" size="sm" onClick={showToast}>
        Show toast
      </Button>
      <Button variant="outline" size="sm" onClick={updateToast}>
        Update toast
      </Button>
    </HStack>
  );
}
