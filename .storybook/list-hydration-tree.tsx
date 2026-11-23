import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { ListIndicator as IndicatorExport } from '../src/components/list-indicator';
import type { ListItem as ItemExport } from '../src/components/list-item';
import type { ListIndicatorProps } from '../src/components/list-props';
import type { ListRoot as RootExport } from '../src/components/list-root';
import type { ListRootPropsProvider as PropsProviderExport } from '../src/components/list-props';

type GetIndicatorProps = Parameters<NonNullable<ListIndicatorProps['asChild']>>[0];

/** Record the parent ref on the hydrated selected SVG. */
function markHydratedIcon(element: Element): void {
  element.setAttribute('data-hydrated-parent-ref', 'received');
}

/** Record the child ref on the hydrated selected SVG. */
function markHydratedChildIcon(element: SVGSVGElement): void {
  element.setAttribute('data-hydrated-child-ref', 'received');
}

/** Render the same consumer-owned icon for server output and hydration. */
function renderHydratedIcon(getProps: GetIndicatorProps): JSX.Element {
  return (
    <svg
      {...getProps({
        class: 'hydrated-list-icon',
        role: 'img',
        'aria-label': 'Hydrated complete',
        viewBox: '0 0 24 24',
        ref: markHydratedChildIcon,
      })}
      id="hydrated-list-svg"
    >
      <path d="M5 12l4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  );
}

export interface ListHydrationComponents {
  ListRoot: typeof RootExport;
  ListRootPropsProvider: typeof PropsProviderExport;
  ListItem: typeof ItemExport;
  ListIndicator: typeof IndicatorExport;
}

/** Build identical List markup with the published server and browser entries. */
export function renderListHydrationTree({
  ListRoot,
  ListRootPropsProvider,
  ListItem,
  ListIndicator,
}: ListHydrationComponents): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Change inherited item styling after hydration. */
  function toggleVariant(): void {
    setPlain(!plain());
  }

  return (
    <ListRootPropsProvider value={{ variant: plain() ? 'plain' : 'marker' }}>
      <ListRoot id="hydrated-list" title="Hydrated tasks">
        <ListItem id="hydrated-list-item">
          <ListIndicator id="hydrated-list-indicator">✓</ListIndicator>
          First task
          <ListRoot as="ol" id="hydrated-nested-list" variant="marker">
            <ListItem id="hydrated-nested-item">Nested task</ListItem>
          </ListRoot>
        </ListItem>
        <ListItem id="hydrated-icon-item">
          <ListIndicator
            asChild={renderHydratedIcon}
            style={{ color: 'var(--lui-colors-green-500)' }}
            ref={markHydratedIcon}
          />
          Icon task
        </ListItem>
      </ListRoot>
      <button type="button" id="list-hydration-toggle" onClick={toggleVariant}>
        Toggle variant
      </button>
    </ListRootPropsProvider>
  );
}
