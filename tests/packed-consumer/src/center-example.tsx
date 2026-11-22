import { Box, Center } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Center's layout and live inline variant. */
export function PackedCenter(): JSX.Element {
  const [inline, setInline] = createSignal(false);

  /** Record the selected native section received through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.centerRef = element.tagName.toLowerCase();
  }

  /** Change the installed display while retaining its child. */
  function toggleInline(): void {
    setInline(!inline());
  }

  return (
    <section id="packed-center-example">
      <Center
        as="section"
        id="packed-flex-center"
        ref={markSection}
        inline={inline()}
        style={{ width: '240px', height: '100px' }}
        aria-label="Packed center"
      >
        <Box id="packed-flex-center-child" class="packed-box-center-child">
          Installed center
        </Box>
      </Center>
      <button id="packed-center-toggle" type="button" onClick={toggleInline}>
        Change packed center
      </button>
    </section>
  );
}
