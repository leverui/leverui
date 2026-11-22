import { Sticky } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Sticky scrolling, native refs, and reactive offsets. */
export function PackedSticky(): JSX.Element {
  const [shifted, setShifted] = createSignal(false);

  /** Record the installed button's native element. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.stickyRef = element.tagName.toLowerCase();
  }

  /** Change the token offset without remounting the child. */
  function toggleOffset(): void {
    setShifted(!shifted());
  }

  return (
    <div
      id="packed-sticky-scroll"
      style={{ 'overflow-y': 'auto', height: '120px', width: '240px' }}
    >
      <div style={{ height: '40px' }}>Before</div>
      <Sticky
        as="button"
        type="button"
        id="packed-sticky"
        ref={markButton}
        style={{ top: shifted() ? '16px' : '0px', height: '24px' }}
        onClick={toggleOffset}
        aria-label="Shift packed sticky"
      >
        <span id="packed-sticky-child">Sticky content</span>
      </Sticky>
      <div style={{ height: '300px' }}>After</div>
    </div>
  );
}
