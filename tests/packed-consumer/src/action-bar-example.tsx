import { ActionBar } from '@leverui/components';
import type { ActionBarOpenChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Action Bar parts with controlled selection. */
export function PackedActionBar(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Reveal the packaged Action Bar on selection. */
  function selectItem(): void {
    setOpen(true);
  }

  /** Follow the primitive dismissal after the close trigger is activated. */
  function changeOpen(details: ActionBarOpenChangeDetails): void {
    setOpen(details.open);
  }

  return (
    <section class="packed-action-bar">
      <button type="button" data-testid="packed-action-bar-open" onClick={selectItem}>
        Select packed item
      </button>
      <ActionBar.Root open={open()} onOpenChange={changeOpen}>
        <ActionBar.Positioner
          class="packed-action-bar-positioner"
          data-testid="packed-action-bar-positioner"
        >
          <ActionBar.Content
            class="packed-action-bar-content"
            aria-label="Packed selection actions"
            data-testid="packed-action-bar-content"
          >
            <ActionBar.SelectionTrigger>1 selected</ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <ActionBar.CloseTrigger data-testid="packed-action-bar-close">
              Close actions
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </ActionBar.Root>
    </section>
  );
}
