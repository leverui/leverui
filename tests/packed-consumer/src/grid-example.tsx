import { Grid, GridItem } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Grid layout and a live GridItem span in a consumer app. */
export function PackedGrid(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the native button supplied through the installed item ref. */
  function markItem(element: HTMLButtonElement): void {
    element.dataset.gridItemRef = element.tagName.toLowerCase();
  }

  /** Change the installed grid tracks without replacing its item. */
  function toggleTracks(): void {
    setWide(!wide());
  }

  return (
    <Grid
      id="packed-grid"
      templateColumns={wide() ? '40px 40px 40px' : '40px 40px'}
      style={{ gap: 'var(--lui-spacing-4)' }}
    >
      <GridItem
        as="button"
        type="button"
        id="packed-grid-item"
        ref={markItem}
        colSpan={wide() ? 2 : 1}
        onClick={toggleTracks}
      >
        <span id="packed-grid-child">Change grid tracks</span>
      </GridItem>
      <GridItem id="packed-grid-second">Second</GridItem>
    </Grid>
  );
}
