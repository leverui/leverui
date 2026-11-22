import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Toast, Toaster, createToaster } from '../index';

afterEach(cleanup);

/** Exercise the public toast store, announcement parts, and dismissal. */
async function verifiesToastLifecycle(): Promise<void> {
  const toaster = createToaster({ placement: 'bottom-end', duration: 30_000 });

  /** Mount the consumer composition around one store. */
  function Example(): JSX.Element {
    /** Create one visible notification through the public store. */
    function showToast(): void {
      toaster.create({ title: 'Saved', description: 'Your work is saved', type: 'success' });
    }

    return (
      <>
        <button type="button" onClick={showToast}>
          Show toast
        </button>
        <Toaster toaster={toaster} data-testid="toaster">
          {
            /** Render one notification through the primitive's current toast context. */
            (toast) => (
              <Toast.Root data-testid="toast-root">
                <Toast.Indicator data-testid="indicator" />
                <Toast.Title
                  ref={
                    /** Capture the caller-owned title element. */
                    (element: Element) => {
                      titleElement = element;
                    }
                  }
                  asChild={
                    /** Keep the caller's data attributes on the primitive's title. */
                    (getProps) => <div {...getProps()} data-testid="owned-title" />
                  }
                >
                  {toast().title}
                </Toast.Title>
                <Toast.Description>{toast().description}</Toast.Description>
                <Toast.CloseTrigger
                  asChild={
                    /** Render the primitive's dismiss action through a caller-owned button. */
                    (getProps) => <button {...getProps()} data-testid="close" />
                  }
                />
              </Toast.Root>
            )
          }
        </Toaster>
      </>
    );
  }

  let titleElement: Element | undefined;
  render(
    /** Mount the test composition inside its Solid owner. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));
  await waitFor(
    /** Wait for Zag to mount the notification. */
    () => expect(screen.getByText('Saved')).not.toBeNull(),
  );
  expect(screen.getByTestId('toaster').getAttribute('aria-label')).toContain('Notifications');
  expect(screen.getByTestId('toast-root').className).toContain('leverui-toast__root');
  expect(screen.getByTestId('indicator').tagName.toLowerCase()).toBe('svg');
  expect(screen.getByTestId('owned-title')).toBe(titleElement);
  expect(titleElement?.hasAttribute('data-toast-title')).toBe(true);
  expect(screen.getByText('Your work is saved')).not.toBeNull();
  fireEvent.click(screen.getByTestId('close'));
  await waitFor(
    /** Wait for the primitive's caller-owned close button to dismiss the toast. */
    () => expect(screen.queryByText('Saved')).toBeNull(),
    { timeout: 5000 },
  );
  toaster.dismiss();
}

it('creates, announces, styles, and dismisses a toast', verifiesToastLifecycle);
