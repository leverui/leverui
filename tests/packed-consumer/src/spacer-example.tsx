import { Flex, Spacer } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Spacer defaults and live native button styling. */
export function PackedSpacer(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Toggle the installed button Spacer's flex weight. */
  function toggleExpansion(): void {
    setExpanded(!expanded());
  }

  return (
    <Flex id="packed-spacer-row" style={{ width: '240px', height: '30px' }}>
      <span style={{ width: '40px' }}>First</span>
      <Spacer
        as="button"
        type="button"
        id="packed-spacer"
        flex={expanded() ? 2 : 1}
        onClick={toggleExpansion}
        aria-label="Expand packed spacer"
      >
        <span id="packed-spacer-child">Space</span>
      </Spacer>
      <Spacer id="packed-spacer-peer" />
      <span style={{ width: '40px' }}>Last</span>
    </Flex>
  );
}
