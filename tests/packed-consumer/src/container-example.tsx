import { Container, ContainerPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Container CSS variants and reactive component defaults. */
export function PackedContainer(): JSX.Element {
  const [fluid, setFluid] = createSignal(false);

  /** Record the native element received through the installed ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.containerRef = element.tagName.toLowerCase();
  }

  /** Change the inherited fluid variant without remounting content. */
  function toggleFluid(): void {
    setFluid(!fluid());
  }

  return (
    <section id="packed-container-example" style={{ width: '1600px' }}>
      <ContainerPropsProvider value={() => ({ fluid: fluid() })}>
        <Container as="section" id="packed-container" ref={markSection}>
          <span id="packed-container-child">Installed container</span>
        </Container>
      </ContainerPropsProvider>
      <button id="packed-container-toggle" type="button" onClick={toggleFluid}>
        Change packed container
      </button>
    </section>
  );
}
