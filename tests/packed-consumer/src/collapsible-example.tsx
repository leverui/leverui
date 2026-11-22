import { Collapsible, type CollapsibleOpenChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed controlled disclosure and consumer stylesheet overrides. */
export function PackedCollapsible(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Follow the installed primitive machine's requested state changes. */
  function changeOpen(details: CollapsibleOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <section class="packed-collapsible">
      <Collapsible.Root open={open()} onOpenChange={changeOpen}>
        <Collapsible.Trigger data-testid="packed-collapsible-trigger">
          Toggle packed details
          <Collapsible.Indicator>›</Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content data-testid="packed-collapsible-content">
          Packed disclosure details
        </Collapsible.Content>
      </Collapsible.Root>
    </section>
  );
}
