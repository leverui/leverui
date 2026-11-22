import { AspectRatio } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/%3E';

/** Exercise the installed ratio, native child, media, and live updates. */
export function PackedAspectRatio(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the native element supplied through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.ratioRef = element.tagName.toLowerCase();
  }

  /** Change the ratio while retaining the installed child node. */
  function toggleRatio(): void {
    setWide(!wide());
  }

  return (
    <section id="packed-aspect-ratio">
      <AspectRatio
        as="section"
        id="packed-ratio"
        ref={markSection}
        ratio={wide() ? 16 / 9 : 1}
        style={{ width: '240px' }}
        aria-label="Packed aspect ratio"
      >
        <div id="packed-ratio-child">Packed ratio child</div>
      </AspectRatio>
      <AspectRatio id="packed-image-ratio" ratio={16 / 9} style={{ width: '160px' }}>
        <img id="packed-ratio-image" src={imageSource} alt="Packed ratio image" />
      </AspectRatio>
      <button id="packed-ratio-toggle" type="button" onClick={toggleRatio}>
        Change packed ratio
      </button>
    </section>
  );
}
