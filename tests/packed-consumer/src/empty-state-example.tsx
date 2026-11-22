import { EmptyState, EmptyStatePropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Record the installed component's selected native root. */
function markRoot(element: HTMLElement): void {
  element.dataset.emptyStateRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the caller-owned title child. */
function markTitle(element: Element): void {
  element.setAttribute('data-empty-state-title-ref', element.tagName.toLowerCase());
}

/** Record the ref supplied by the Empty State title wrapper. */
function markTitleParent(element: Element): void {
  element.setAttribute('data-empty-state-title-parent-ref', element.tagName.toLowerCase());
}

/** Exercise public parts, native refs, and live appearance defaults. */
export function PackedEmptyState(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the inherited size while preserving the mounted root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <EmptyStatePropsProvider value={() => ({ size: large() ? 'lg' : 'sm' })}>
        <EmptyState.Root id="packed-empty-state" as="section" ref={markRoot} role="status">
          <EmptyState.Content id="packed-empty-content">
            <EmptyState.Indicator id="packed-empty-indicator">◎</EmptyState.Indicator>
            <EmptyState.Title
              asChild={
                /** Apply the published title slot to a caller-owned heading. */
                (getProps) => (
                  <h2 {...getProps({ ref: markTitle })} id="packed-empty-title">
                    No items
                  </h2>
                )
              }
              ref={markTitleParent}
            />
            <EmptyState.Description id="packed-empty-description">
              Add one to begin.
            </EmptyState.Description>
            <button id="packed-empty-action" type="button">
              Add item
            </button>
          </EmptyState.Content>
        </EmptyState.Root>
      </EmptyStatePropsProvider>
      <button id="packed-empty-toggle" type="button" onClick={toggleSize}>
        Toggle size
      </button>
    </>
  );
}
