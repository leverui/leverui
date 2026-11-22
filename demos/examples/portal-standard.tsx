import { Show, createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal as SolidPortal } from '@solidjs/web';
import { Portal } from '../../src';

/** Show the text moved to the document body. */
export function PortalBasic(): JSX.Element {
  return (
    <>
      <p>Welcome</p>
      <Portal>This text renders at the end of the page</Portal>
    </>
  );
}

/** Show a Portal targeting a caller-provided element. */
export function PortalWithContainer(): JSX.Element {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  /** Capture the destination once Solid mounts the native element. */
  function captureContainer(element: HTMLDivElement): void {
    setContainer(element);
  }

  /** Mount text in the consumer's requested container. */
  function renderIntoContainer(target: Accessor<HTMLDivElement>): JSX.Element {
    return (
      <Portal container={target()}>
        <span>This text renders inside the container</span>
      </Portal>
    );
  }

  return (
    <>
      <Show when={container()}>{renderIntoContainer}</Show>
      <div ref={captureContainer} data-testid="portal-container" />
    </>
  );
}

/** Show an iframe whose own environment receives the nested Portal. */
export function PortalWithIframe(): JSX.Element {
  const [frameDocument, setFrameDocument] = createSignal<Document>();
  return (
    <>
      <iframe
        title="Portal iframe"
        srcdoc="<body></body>"
        onLoad={
          /** Read the same-origin frame document after it loads. */
          (event) => setFrameDocument(event.currentTarget.contentDocument ?? undefined)
        }
      />
      <Show when={frameDocument()}>
        {
          /** Render the heading in the frame while Portal uses the outer document. */
          (frameRoot) => (
            <SolidPortal mount={frameRoot().body}>
              <h1>Welcome</h1>
              <Portal>Welcome</Portal>
            </SolidPortal>
          )
        }
      </Show>
    </>
  );
}
