import { type JSX } from '@solidjs/web';
import { Toast, Toaster, createToaster, type CreateToasterProps } from '../src';
import './toast-demo.css';

/** Configuration exposed by the spatial and page-idle Toast stories. */
export interface ToastAdvancedExampleProps {
  placement: CreateToasterProps['placement'];
  offsets?: CreateToasterProps['offsets'];
  overlap?: CreateToasterProps['overlap'];
  pauseOnPageIdle?: CreateToasterProps['pauseOnPageIdle'];
  duration?: CreateToasterProps['duration'];
  closable?: boolean;
}

/** Mount the public toaster with one explicitly selected store configuration. */
export function ToastAdvancedExample(props: ToastAdvancedExampleProps): JSX.Element {
  const toaster = createToaster({
    placement: props.placement,
    offsets: props.offsets,
    overlap: props.overlap,
    pauseOnPageIdle: props.pauseOnPageIdle,
    duration: props.duration ?? 30_000,
  });
  let nextNumber = 0;
  let latestId: string | undefined;

  /** Add another notification so stacking and overlap can be compared. */
  function createNotification(): void {
    nextNumber += 1;
    latestId = toaster.create({
      title: `Notification ${nextNumber}`,
      type: 'info',
      closable: props.closable ?? true,
    });
  }

  /** Pause the newest notification through the public store API. */
  function pauseNotification(): void {
    if (latestId) toaster.pause(latestId);
  }

  /** Resume a notification explicitly paused by the consumer. */
  function resumeNotification(): void {
    if (latestId) toaster.resume(latestId);
  }

  /** Update the newest notification without changing its pause reason. */
  function updateNotification(): void {
    if (latestId) toaster.update(latestId, { title: 'Updated notification' });
  }

  return (
    <>
      <button type="button" data-testid="advanced-create" onClick={createNotification}>
        Create notification
      </button>
      <button type="button" data-testid="advanced-pause" onClick={pauseNotification}>
        Pause notification
      </button>
      <button type="button" data-testid="advanced-resume" onClick={resumeNotification}>
        Resume notification
      </button>
      <button type="button" data-testid="advanced-update" onClick={updateNotification}>
        Update notification
      </button>
      <Toaster toaster={toaster} class="toast-demo-region" data-testid="advanced-region">
        {
          /** Render each live store item through its primitive toast context. */
          (item) => (
            <Toast.Root class="toast-demo-root" data-testid="advanced-toast">
              <Toast.Content>
                <Toast.Title>{item().title}</Toast.Title>
              </Toast.Content>
              {item().closable && <Toast.CloseTrigger data-testid="advanced-close" />}
            </Toast.Root>
          )
        }
      </Toaster>
    </>
  );
}
