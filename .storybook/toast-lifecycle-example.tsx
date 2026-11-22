import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Spinner, Toast, Toaster, createToaster } from '../src';

/** Exercise the Zag-backed toast store beyond the basic visual specimen. */
export function ToastLifecycleExample(): JSX.Element {
  const toaster = createToaster({ placement: 'bottom-end', duration: 800, max: 2 });
  const [promisePending, setPromisePending] = createSignal(false);
  let loadingId = '';
  let timedId = '';
  let firstQueuedId = '';
  let resolvePending: (() => void) | undefined;
  let rejectPending: (() => void) | undefined;

  /** Create a loading toast that stays visible until explicitly updated. */
  function showLoading(): void {
    loadingId = toaster.create({ title: 'Uploading', type: 'loading', duration: 200 });
  }

  /** Replace the persistent notification with a short success state. */
  function completeLoading(): void {
    if (loadingId) toaster.update(loadingId, { title: 'Uploaded', type: 'success', duration: 200 });
  }

  /** Hold a promise so the browser can observe its loading state. */
  function startPromise(): void {
    if (promisePending()) return;
    const pending = new Promise<void>(
      /** Expose resolution only through the fixture's visible control. */
      (resolve, reject) => {
        resolvePending = resolve;
        /** Reject the held operation with the fixture's fixed error. */
        rejectPending = () => reject(new Error('Upload failed'));
      },
    );
    setPromisePending(true);
    toaster.promise(pending, {
      loading: { title: 'Promise pending' },
      success: { title: 'Promise resolved' },
      error: { title: 'Promise rejected' },
    });
  }

  /** Resolve the in-flight promise and let the store update its toast. */
  function resolvePromise(): void {
    resolvePending?.();
    resolvePending = undefined;
    rejectPending = undefined;
    setPromisePending(false);
  }

  /** Reject the held promise so the store renders its error option. */
  function rejectPromise(): void {
    rejectPending?.();
    rejectPending = undefined;
    resolvePending = undefined;
    setPromisePending(false);
  }

  /** Start a finite notification and expose its lifecycle status. */
  function showTimed(): void {
    timedId = toaster.create({
      title: 'Timed notification',
      type: 'info',
      duration: 800,
      /** Publish the machine status for a browser assertion. */
      onStatusChange(details) {
        document.body.dataset.toastStatus = details.status;
      },
    });
  }

  /** Suspend the timed toast's remaining dismissal time. */
  function pauseTimed(): void {
    if (timedId) toaster.pause(timedId);
  }

  /** Continue the timed toast's remaining dismissal time. */
  function resumeTimed(): void {
    if (timedId) toaster.resume(timedId);
  }

  /** Fill both visible slots and leave a third notification queued. */
  function enqueueThree(): void {
    firstQueuedId = toaster.create({ title: 'Queue first', duration: Infinity });
    toaster.create({ title: 'Queue second', duration: Infinity });
    toaster.create({ title: 'Queue third', duration: Infinity });
  }

  /** Dismiss the first visible notification so the queued one can enter. */
  function dismissFirst(): void {
    if (firstQueuedId) toaster.dismiss(firstQueuedId);
  }

  return (
    <>
      <button type="button" data-testid="lifecycle-loading" onClick={showLoading}>
        Start loading
      </button>
      <button type="button" data-testid="lifecycle-complete" onClick={completeLoading}>
        Complete loading
      </button>
      <button
        type="button"
        data-testid="lifecycle-promise"
        disabled={promisePending()}
        onClick={startPromise}
      >
        Start promise
      </button>
      <button
        type="button"
        data-testid="lifecycle-resolve"
        disabled={!promisePending()}
        onClick={resolvePromise}
      >
        Resolve promise
      </button>
      <button
        type="button"
        data-testid="lifecycle-reject"
        disabled={!promisePending()}
        onClick={rejectPromise}
      >
        Reject promise
      </button>
      <button type="button" data-testid="lifecycle-timed" onClick={showTimed}>
        Start timer
      </button>
      <button type="button" data-testid="lifecycle-pause" onClick={pauseTimed}>
        Pause timer
      </button>
      <button type="button" data-testid="lifecycle-resume" onClick={resumeTimed}>
        Resume timer
      </button>
      <button type="button" data-testid="lifecycle-queue" onClick={enqueueThree}>
        Queue three
      </button>
      <button type="button" data-testid="lifecycle-dismiss-first" onClick={dismissFirst}>
        Dismiss first
      </button>
      <Toaster toaster={toaster} data-testid="lifecycle-region">
        {
          /** Render each store item under its active primitive toast context. */
          (item) => (
            <Toast.Root data-testid="lifecycle-toast">
              {item().type === 'loading' ? (
                <Spinner size="sm" aria-hidden="true" data-testid="lifecycle-spinner" />
              ) : (
                <Toast.Indicator />
              )}
              <Toast.Content>
                <Toast.Title>{item().title}</Toast.Title>
              </Toast.Content>
              <Toast.CloseTrigger />
            </Toast.Root>
          )
        }
      </Toaster>
    </>
  );
}
