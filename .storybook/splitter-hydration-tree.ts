import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  SplitterPanel as PanelExport,
  SplitterResizeTrigger as TriggerExport,
  SplitterRoot as RootExport,
} from '../src';

export interface SplitterHydrationComponents {
  SplitterRoot: typeof RootExport;
  SplitterPanel: typeof PanelExport;
  SplitterResizeTrigger: typeof TriggerExport;
}

/** Build the same two-panel tree for published SSR and browser hydration. */
export function renderSplitterHydrationTree({
  SplitterRoot,
  SplitterPanel,
  SplitterResizeTrigger,
}: SplitterHydrationComponents): JSX.Element {
  return createComponent(SplitterRoot, {
    panels: [{ id: 'a' }, { id: 'b' }],
    defaultSize: [40, 60],
    style: { width: '300px', height: '100px' },
    id: 'hydrated-splitter',
    /** Preserve the panel and trigger order across renderers. */
    get children() {
      return [
        createComponent(SplitterPanel, {
          id: 'a',
          'data-testid': 'hydrated-splitter-a',
          children: 'First',
        }),
        createComponent(SplitterResizeTrigger, {
          id: 'a:b' as const,
        }),
        createComponent(SplitterPanel, {
          id: 'b',
          'data-testid': 'hydrated-splitter-b',
          children: 'Second',
        }),
      ];
    },
  });
}
