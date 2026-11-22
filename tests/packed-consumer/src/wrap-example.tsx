import { Wrap, WrapItem } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Wrap layout, item refs, and reactive spacing. */
export function PackedWrap(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Record the native button selected through WrapItem's public ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.wrapRef = element.tagName.toLowerCase();
  }

  /** Change the installed root's spacing without replacing its items. */
  function toggleGap(): void {
    setExpanded(!expanded());
  }

  return (
    <Wrap id="packed-wrap" style={{ width: '112px' }} gap={expanded() ? '4' : '2'}>
      <WrapItem
        as="button"
        type="button"
        id="packed-wrap-item"
        ref={markButton}
        style={{ width: '48px', height: '24px' }}
        onClick={toggleGap}
        aria-label="Change packed wrap gap"
      >
        <span id="packed-wrap-child">One</span>
      </WrapItem>
      <WrapItem id="packed-wrap-second" style={{ width: '48px', height: '24px' }}>
        Two
      </WrapItem>
      <WrapItem id="packed-wrap-third" style={{ width: '48px', height: '24px' }}>
        Three
      </WrapItem>
    </Wrap>
  );
}
