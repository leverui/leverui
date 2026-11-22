import { type JSX } from '@solidjs/web';
import { Toast, Toaster, createToaster } from '../src';
import './toast-demo.css';

/** Exercise Lever UI's toast lifecycle in a real browser. */
export function ToastContractExample(): JSX.Element {
  const toaster = createToaster({ placement: 'bottom-end', duration: 30_000, max: 2 });
  let latestId = '';

  /** Open a success toast with an action. */
  function showSuccess(): void {
    latestId = toaster.create({
      title: 'Saved',
      description: 'Your work is saved',
      type: 'success',
      action: {
        label: 'Undo',
        /** Report the action through a visible browser assertion target. */
        onClick() {
          document.body.dataset.toastAction = 'undo';
        },
      },
    });
  }

  /** Open an error toast with the status glyph. */
  function showError(): void {
    latestId = toaster.create({ title: 'Could not save', type: 'error' });
  }

  /** Open a warning toast for visual status comparison. */
  function showWarning(): void {
    latestId = toaster.create({ title: 'Check this', type: 'warning' });
  }

  /** Open the default surface with body text. */
  function showInfo(): void {
    latestId = toaster.create({
      title: 'Update available',
      description: 'A new version is ready',
      type: 'info',
      action: {
        label: 'View',
        /** Expose the default-surface action to the browser specimen. */
        onClick() {
          document.body.dataset.toastAction = 'view';
        },
      },
    });
  }

  /** Update the most recently opened toast without creating another one. */
  function updateLatest(): void {
    if (latestId) toaster.update(latestId, { title: 'Updated' });
  }

  /** Dismiss all currently visible notifications. */
  function dismissAll(): void {
    toaster.dismiss();
  }

  return (
    <>
      <button type="button" data-testid="toast-success" onClick={showSuccess}>
        Show success
      </button>
      <button type="button" data-testid="toast-error" onClick={showError}>
        Show error
      </button>
      <button type="button" data-testid="toast-warning" onClick={showWarning}>
        Show warning
      </button>
      <button type="button" data-testid="toast-info" onClick={showInfo}>
        Show info
      </button>
      <button type="button" data-testid="toast-update" onClick={updateLatest}>
        Update latest
      </button>
      <button type="button" data-testid="toast-dismiss" onClick={dismissAll}>
        Dismiss all
      </button>
      <Toaster toaster={toaster} class="toast-demo-region" data-testid="toast-region">
        {
          /** Render each store item under its own primitive toast context. */
          (item) => (
            <Toast.Root class="toast-demo-root" data-testid="toast-root">
              <Toast.Indicator data-testid="toast-indicator" />
              <Toast.Content>
                <Toast.Title>{item().title}</Toast.Title>
                <Toast.Description>{item().description}</Toast.Description>
              </Toast.Content>
              {item().action && (
                <Toast.ActionTrigger data-testid="toast-action">
                  {item().action?.label}
                </Toast.ActionTrigger>
              )}
              <Toast.CloseTrigger data-testid="toast-close" />
            </Toast.Root>
          )
        }
      </Toaster>
    </>
  );
}
