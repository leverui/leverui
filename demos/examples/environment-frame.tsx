import { createSignal, Show, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal as SolidPortal } from '@solidjs/web';

interface EnvironmentFrameProps {
  render: (document: Document) => JSX.Element;
  width?: string;
}

/** Mount Solid content in a same-origin frame after its document loads. */
export function EnvironmentFrame(props: EnvironmentFrameProps): JSX.Element {
  const [frameDocument, setFrameDocument] = createSignal<Document>();
  let frame: HTMLIFrameElement | undefined;

  /** Capture the frame document after its srcdoc navigation. */
  function captureFrameDocument(): void {
    if (frame?.contentDocument) setFrameDocument(frame.contentDocument);
  }

  /** Render the supplied content under the frame's own body. */
  function renderFrameContent(root: Accessor<Document>): JSX.Element {
    return <SolidPortal mount={root().body}>{props.render(root())}</SolidPortal>;
  }

  return (
    <>
      <iframe
        title="Environment frame"
        ref={frame}
        width="300"
        height="150"
        style={{ border: '0', width: props.width }}
        srcdoc="<body style='background:yellow'></body>"
        onLoad={captureFrameDocument}
      />
      <Show when={frameDocument()}>{renderFrameContent}</Show>
    </>
  );
}
