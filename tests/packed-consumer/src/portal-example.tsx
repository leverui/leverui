import { Portal } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed portal's custom container type and browser output. */
export function PackedPortal(): JSX.Element {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  /** Capture the destination after Solid creates its native element. */
  function captureContainer(element: HTMLDivElement): void {
    setContainer(element);
  }

  return (
    <section id="packed-portal">
      <div id="packed-portal-container" ref={captureContainer} />
      <Portal container={container}>
        <span id="packed-portal-child">Installed portal</span>
      </Portal>
    </section>
  );
}
