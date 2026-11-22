import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  TimelineConnector as ConnectorExport,
  TimelineContent as ContentExport,
  TimelineIndicator as IndicatorExport,
  TimelineItem as ItemExport,
  TimelineRoot as RootExport,
  TimelineRootPropsProvider as PropsProviderExport,
  TimelineSeparator as SeparatorExport,
  TimelineTitle as TitleExport,
} from '../src';

export interface TimelineHydrationComponents {
  TimelineRootPropsProvider: typeof PropsProviderExport;
  TimelineRoot: typeof RootExport;
  TimelineItem: typeof ItemExport;
  TimelineConnector: typeof ConnectorExport;
  TimelineSeparator: typeof SeparatorExport;
  TimelineIndicator: typeof IndicatorExport;
  TimelineContent: typeof ContentExport;
  TimelineTitle: typeof TitleExport;
}

/** Build matching server and browser Timeline trees with live size state. */
export function renderTimelineHydrationTree(components: TimelineHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited marker size after hydration. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return createComponent(components.TimelineRootPropsProvider, {
    /** Follow changing size through the public provider. */
    value: () => ({ size: large() ? 'xl' : 'sm' }),
    /** Construct the native list and toggle together. */
    get children() {
      return [
        createComponent(components.TimelineRoot, {
          id: 'hydrated-timeline',
          /** Build the event inside the root style context. */
          get children() {
            return createComponent(components.TimelineItem, {
              id: 'hydrated-timeline-item',
              /** Place marker and content beside one another. */
              get children() {
                return [
                  createComponent(components.TimelineConnector, {
                    /** Render the line behind its event marker. */
                    get children() {
                      return [
                        createComponent(components.TimelineSeparator, {}),
                        createComponent(components.TimelineIndicator, {
                          id: 'hydrated-timeline-indicator',
                          children: '1',
                        }),
                      ];
                    },
                  }),
                  createComponent(components.TimelineContent, {
                    /** Render the event title in its slot. */
                    get children() {
                      return createComponent(components.TimelineTitle, {
                        children: 'Hydrated event',
                      });
                    },
                  }),
                ];
              },
            });
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'timeline-hydration-toggle',
          type: 'button',
          onClick: toggleSize,
          children: 'Toggle Timeline size',
        }),
      ];
    },
  });
}
