import { Badge, BadgePropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Mark the selected native section passed to a consumer ref. */
function markSection(element: HTMLElement): void {
  element.dataset.badgeRef = element.tagName.toLowerCase();
}

/** Exercise installed Badge styling, default inheritance, and native props. */
export function PackedBadge(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the provider's default size in place. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <Badge id="packed-badge-solid" variant="solid" colorPalette="blue" title="Package status">
        Active
      </Badge>
      <BadgePropsProvider
        value={{ size: large() ? 'lg' : 'xs', variant: 'outline', class: 'provider-badge' }}
      >
        <Badge id="packed-badge-inherited">Inherited</Badge>
        <Badge class="fixed-badge" id="packed-badge-fixed" size="sm">
          Fixed
        </Badge>
      </BadgePropsProvider>
      <Badge as="section" ref={markSection} id="packed-badge-section">
        Section
      </Badge>
      <button id="packed-badge-toggle" type="button" onClick={toggleSize}>
        Change Badge
      </button>
    </>
  );
}
