import { SiteIcon } from './site-icon';
import { Dialog, Input, Portal, type DialogOpenChangeDetails } from '@leverui/components';
import { createMemo, createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Guide } from '../lib/docs';
import '../styles/site-search.css';

/** Search the maintained guides without a hosted search service. */
export function SiteSearch(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const [guides, setGuides] = createSignal<readonly Guide[]>([]);
  const [loadError, setLoadError] = createSignal(false);
  let loading = false;

  const results = createMemo(
    /** Rank title matches before body matches and keep the dialog compact. */
    () => {
      const term = query().trim().toLowerCase();
      if (!term) return guides().slice(0, 10);
      const matches = guides().filter(
        /** Search both public titles and maintained guide text. */
        (guide) =>
          guide.title.toLowerCase().includes(term) || guide.content.toLowerCase().includes(term),
      );
      return matches
        .sort(
          /** Put title matches first without disturbing alphabetical order. */
          (first, second) =>
            Number(second.title.toLowerCase().includes(term)) -
            Number(first.title.toLowerCase().includes(term)),
        )
        .slice(0, 12);
    },
  );

  /** Load the guide index only when someone opens search. */
  async function loadGuides(): Promise<void> {
    if (guides().length || loading) return;
    loading = true;
    try {
      const module = await import('../lib/docs');
      setGuides(module.guides);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      loading = false;
    }
  }

  /** Keep the controlled dialog synchronized with its machine. */
  function updateOpen(details: DialogOpenChangeDetails): void {
    setOpen(details.open);
    if (details.open) void loadGuides();
  }

  /** Update search results as the visitor types. */
  function updateQuery(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setQuery(event.currentTarget.value);
  }

  /** Close search before navigating to a guide. */
  function closeSearch(): void {
    setOpen(false);
    setQuery('');
  }

  /** Open search from the familiar Command or Control K shortcut. */
  function handleShortcut(event: KeyboardEvent): void {
    if (event.key.toLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) return;
    event.preventDefault();
    setOpen(true);
    void loadGuides();
  }

  /** Focus the search input when the dialog opens. */
  function initialFocus(): HTMLElement | null {
    return document.getElementById('site-search-input');
  }

  onSettled(() => {
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  return (
    <Dialog.Root open={open()} onOpenChange={updateOpen} initialFocusEl={initialFocus}>
      <Dialog.Trigger
        class="site-search-trigger"
        aria-label="Search documentation"
        onClick={loadGuides}
      >
        <SiteIcon name="search" />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop class="site-search-backdrop" />
        <Dialog.Positioner class="site-search-positioner">
          <Dialog.Content class="site-search-dialog">
            <Dialog.Title class="visually-hidden">Search documentation</Dialog.Title>
            <Dialog.Description class="visually-hidden">
              Search component and system guides.
            </Dialog.Description>
            <div class="site-search-field">
              <Input
                id="site-search-input"
                aria-label="Search documentation"
                placeholder="Search components and guides..."
                value={query()}
                onInput={updateQuery}
              />
            </div>
            <div class="site-search-results" aria-live="polite">
              <Show when={!loadError()} fallback={<p>Search could not load. Please try again.</p>}>
                <For each={results()} fallback={<p>No matching guides found.</p>}>
                  {/** Link directly to the statically generated guide. */}
                  {(guide) => (
                    <a href={guide.path} onClick={closeSearch}>
                      <span>{guide.kind === 'component' ? 'Component' : 'Guide'}</span>
                      <strong>{guide.title}</strong>
                      <SiteIcon name="arrow-right" />
                    </a>
                  )}
                </For>
              </Show>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
