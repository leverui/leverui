import { type JSX } from '@solidjs/web';
import { EnvironmentProvider, Portal } from '../../src';
import { EnvironmentFrame } from './environment-frame';

/** Render one child and one portal under the frame's environment. */
function renderFramePortal(document: Document): JSX.Element {
  return (
    <EnvironmentProvider value={document}>
      <span>Content in the frame</span>
      <Portal>Inside iframe</Portal>
    </EnvironmentProvider>
  );
}

/** Compare default-document and frame-document portal destinations. */
export function EnvironmentWithPortal(): JSX.Element {
  return (
    <div>
      <h1>Portal destinations</h1>
      <p>One portal mounts in this page and one mounts inside the yellow frame.</p>
      <Portal>Outside iframe</Portal>
      <EnvironmentFrame render={renderFramePortal} />
    </div>
  );
}
