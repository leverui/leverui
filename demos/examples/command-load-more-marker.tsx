import { onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box } from '../../src';

/** Request the next page once this marker scrolls into the list. */
export function LoadMoreMarker(props: { loading: boolean; onVisible: () => void }): JSX.Element {
  let marker!: HTMLDivElement;
  onSettled(() => {
    const observer = new IntersectionObserver(
      /** Request more results once the marker is visible. */
      ([entry]) => {
        if (entry?.isIntersecting) props.onVisible();
      },
      { root: marker.closest('[role=listbox]'), rootMargin: '64px' },
    );
    observer.observe(marker);
    return () => observer.disconnect();
  });
  return (
    <Box
      ref={marker}
      textStyle="xs"
      style={{
        'padding-block': 'var(--leverui-spacing-2)',
        'text-align': 'center',
        color: 'var(--leverui-colors-fg-muted)',
      }}
    >
      <Show when={props.loading}>Loading more…</Show>
    </Box>
  );
}
