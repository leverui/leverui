import { Alert, AlertPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Record the selected native root from the installed Alert. */
function markRoot(element: HTMLElement): void {
  element.dataset.alertRef = element.tagName.toLowerCase();
}

/** Record the rendered child title from the installed Alert. */
function markChild(element: HTMLElement): void {
  element.dataset.alertChildRef = element.tagName.toLowerCase();
}

/** Exercise Alert parts, native selection, child rendering, and reactive defaults. */
export function PackedAlert(): JSX.Element {
  const [success, setSuccess] = createSignal(false);

  /** Read current defaults whenever the installed Alert root requests them. */
  function readDefaults() {
    return { status: success() ? ('success' as const) : ('info' as const) };
  }

  /** Change the status without remounting the package's Alert root. */
  function toggleStatus(): void {
    setSuccess(!success());
  }

  return (
    <>
      <AlertPropsProvider value={readDefaults}>
        <Alert.Root id="packed-alert" as="section" ref={markRoot} role="status">
          <Alert.Indicator id="packed-alert-indicator" />
          <Alert.Content>
            <Alert.Title
              asChild={
                /** Merge Alert title styling into the native child button. */
                (getProps) => (
                  <button {...getProps()} id="packed-alert-title" type="button">
                    Package alert
                  </button>
                )
              }
              ref={markChild}
            />
            <Alert.Description id="packed-alert-description">Details</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </AlertPropsProvider>
      <button id="packed-alert-toggle" type="button" onClick={toggleStatus}>
        Change Alert
      </button>
    </>
  );
}
