import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal as SolidPortal } from '@solidjs/web';
import { EnvironmentProvider, Toast, Toaster, createToaster } from '../src';

/** Exercise page-idle timing when an EnvironmentProvider owns another document. */
export function ToastEnvironmentExample(): JSX.Element {
  const [frameDocument, setFrameDocument] = createSignal<Document>();
  const toaster = createToaster({ placement: 'bottom-end', duration: 800, pauseOnPageIdle: true });
  let frame: HTMLIFrameElement | undefined;

  /** Capture the document that should own the toast machine and listener. */
  function captureFrameDocument(): void {
    if (frame?.contentDocument) setFrameDocument(frame.contentDocument);
  }

  /** Create a finite notification inside the provided document. */
  function createNotification(): void {
    toaster.create({ title: 'Frame notification', type: 'info' });
  }

  return (
    <>
      <button type="button" data-testid="frame-create" onClick={createNotification}>
        Create frame notification
      </button>
      <iframe
        title="Toast environment"
        data-testid="toast-frame"
        ref={frame}
        onLoad={captureFrameDocument}
      />
      <Show when={frameDocument()}>
        {
          /** Keep the region in the same document as its environment provider. */
          (ownerDocument) => (
            <SolidPortal mount={ownerDocument().body}>
              <EnvironmentProvider value={ownerDocument()}>
                <Toaster toaster={toaster} data-testid="frame-region">
                  {
                    /** Render the frame toast through the public primitive-backed parts. */
                    (item) => (
                      <Toast.Root data-testid="frame-toast">
                        <Toast.Content>
                          <Toast.Title>{item().title}</Toast.Title>
                        </Toast.Content>
                      </Toast.Root>
                    )
                  }
                </Toaster>
              </EnvironmentProvider>
            </SolidPortal>
          )
        }
      </Show>
    </>
  );
}

/** Keep one Toaster mounted while its provider switches to an iframe document. */
export function ToastReactiveEnvironmentExample(): JSX.Element {
  const [frameDocument, setFrameDocument] = createSignal<Document>();
  const [rootDocument, setRootDocument] = createSignal<Document>(document);
  const [pauseState, setPauseState] = createSignal('none');
  const toaster = createToaster({ placement: 'bottom-end', duration: 30_000 });
  let frame: HTMLIFrameElement | undefined;

  /** Make the iframe document available after its initial navigation. */
  function captureFrameDocument(): void {
    if (frame?.contentDocument) setFrameDocument(frame.contentDocument);
  }

  /** Switch the mounted Toaster to another owning document. */
  function switchRoot(): void {
    const next = frameDocument();
    if (next) setRootDocument(next);
  }

  /** Create a finite toast before the environment changes. */
  function createNotification(): void {
    toaster.create({ title: 'Moving notification', type: 'info' });
  }

  /** Expose the store's paused state for the browser document check. */
  function readPauseState(): void {
    const item = toaster.getVisibleToasts()[0];
    // Zag 2 marks a paused toast with `paused: true`.
    const paused = item !== undefined && 'paused' in item && item.paused === true;
    setPauseState(item ? (paused ? 'paused' : 'running') : 'none');
  }

  return (
    <>
      <button type="button" data-testid="root-create" onClick={createNotification}>
        Create notification
      </button>
      <button
        type="button"
        data-testid="root-switch"
        disabled={!frameDocument()}
        onClick={switchRoot}
      >
        Use frame document
      </button>
      <button type="button" data-testid="root-read-pause" onClick={readPauseState}>
        Read pause state
      </button>
      <output data-testid="root-pause-state">{pauseState()}</output>
      <iframe
        title="Alternate toast root"
        data-testid="root-frame"
        ref={frame}
        onLoad={captureFrameDocument}
      />
      <EnvironmentProvider value={() => rootDocument()}>
        <Toaster toaster={toaster} data-testid="root-region">
          {
            /** Keep the region mounted while its environment root changes. */
            (item) => (
              <Toast.Root data-testid="root-toast">
                <Toast.Content>
                  <Toast.Title>{item().title}</Toast.Title>
                </Toast.Content>
              </Toast.Root>
            )
          }
        </Toaster>
      </EnvironmentProvider>
    </>
  );
}
