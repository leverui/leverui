import { Box, Flex } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Flex aliases and live native button behavior. */
export function PackedFlex(): JSX.Element {
  const [column, setColumn] = createSignal(false);

  /** Record the native button received through the installed ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.flexRef = element.tagName.toLowerCase();
  }

  /** Change the installed flex direction without remounting an item. */
  function toggleDirection(): void {
    setColumn(!column());
  }

  return (
    <section id="packed-flex-example">
      <Flex
        as="button"
        type="button"
        id="packed-flex"
        ref={markButton}
        direction={column() ? 'column' : 'row'}
        style={{ gap: 'var(--lui-spacing-4)', width: '240px', height: '80px' }}
        onClick={toggleDirection}
        aria-label="Packed flex"
      >
        <Box id="packed-flex-child" class="packed-box-flex-item">
          A
        </Box>
        <Box id="packed-flex-second" class="packed-box-flex-item">
          B
        </Box>
      </Flex>
    </section>
  );
}
