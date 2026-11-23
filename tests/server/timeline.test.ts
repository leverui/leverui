import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  TimelineConnector as ConnectorExport,
  TimelineContent as ContentExport,
  TimelineDescription as DescriptionExport,
  TimelineIndicator as IndicatorExport,
  TimelineItem as ItemExport,
  TimelineRoot as RootExport,
  TimelineSeparator as SeparatorExport,
  TimelineTitle as TitleExport,
} from '../../src';

type ServerComponents = {
  TimelineRoot: typeof RootExport;
  TimelineItem: typeof ItemExport;
  TimelineConnector: typeof ConnectorExport;
  TimelineSeparator: typeof SeparatorExport;
  TimelineIndicator: typeof IndicatorExport;
  TimelineContent: typeof ContentExport;
  TimelineTitle: typeof TitleExport;
  TimelineDescription: typeof DescriptionExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render an event through the published server entry. */
function renderServerTimeline(): string {
  return renderToString(
    /** Build the list without requiring a styling provider. */
    () =>
      createComponent(server.TimelineRoot<'div'>, {
        id: 'server-timeline',
        size: 'sm',
        variant: 'outline',
        showLastSeparator: true,
        /** Build the event inside the root context. */
        get children() {
          return createComponent(server.TimelineItem, {
            id: 'server-timeline-item',
            /** Render marker and content as neighboring parts. */
            get children() {
              return [
                createComponent(server.TimelineConnector, {
                  /** Keep the line behind its marker. */
                  get children() {
                    return [
                      createComponent(server.TimelineSeparator, {}),
                      createComponent(server.TimelineIndicator, { children: '1' }),
                    ];
                  },
                }),
                createComponent(server.TimelineContent, {
                  /** Render the title and supporting date. */
                  get children() {
                    return [
                      createComponent(server.TimelineTitle, { children: 'Shipped' }),
                      createComponent(server.TimelineDescription, { children: 'Today' }),
                    ];
                  },
                }),
              ];
            },
          });
        },
      }),
  );
}

/** Verify native semantics and authored CSS choices in SSR. */
function verifiesServerTimeline(): void {
  const markup = renderServerTimeline();
  expect(markup).toMatch(/<div[^>]*id="server-timeline"[^>]*role="list"/);
  expect(markup).toMatch(/<div[^>]*id="server-timeline-item"[^>]*role="listitem"/);
  expect(markup).toContain('leverui-timeline__separator');
  expect(markup).toContain('leverui-timeline__indicator');
  expect(markup).toContain('Shipped');
  expect(markup).toContain('Today');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-variant="outline"');
  expect(markup).toContain('data-show-last-separator="true"');
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  expect(markup).not.toContain('--lui-private-timeline-indicator-size');
  expect(markup).not.toMatch(/--timeline-(?:indicator-size|content-gap|separator-display)/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|variant|showLastSeparator|recipe|css|unstyled)=/);
}

test(
  'published Timeline renders native list parts and authored CSS choices',
  verifiesServerTimeline,
);
