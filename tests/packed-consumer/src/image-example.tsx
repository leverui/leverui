import { Image } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/%3E';

/** Exercise the installed Image package's native aliases and live styles. */
export function PackedImage(): JSX.Element {
  const [contained, setContained] = createSignal(false);

  /** Record the installed native image ref. */
  function markImage(element: HTMLImageElement): void {
    element.dataset.imageRef = element.tagName.toLowerCase();
  }

  /** Change fit without replacing the native image. */
  function toggleFit(): void {
    setContained(!contained());
  }

  return (
    <section id="packed-image-section">
      <Image
        id="packed-image"
        src={imageSource}
        alt="Packed image"
        htmlWidth={contained() ? 240 : 200}
        htmlHeight={100}
        style={{ width: '120px', height: '90px' }}
        fit={contained() ? 'contain' : undefined}
        ref={markImage}
      />
      <button id="packed-image-toggle" type="button" onClick={toggleFit}>
        Change fit
      </button>
    </section>
  );
}
