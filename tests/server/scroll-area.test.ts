import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { ScrollArea as AreaExport } from '../../src';

type ServerComponents = {
  ScrollArea: typeof AreaExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render machine parts with context through the published server entry. */
function renderServerScrollArea(): string {
  return renderToString(
    /** Keep every part beneath its matching root during SSR. */
    () =>
      createComponent(server.ScrollArea.Root, {
        id: 'server-scroll-area',
        style: { height: '8rem' },
        /** Create the scroll parts beneath the machine root. */
        get children() {
          return [
            createComponent(server.ScrollArea.Viewport, {
              /** Keep content inside the measured viewport. */
              get children() {
                return createComponent(server.ScrollArea.Content, {
                  children: 'Server scroll content',
                });
              },
            }),
            createComponent(server.ScrollArea.Scrollbar, {}),
          ];
        },
      }),
  );
}

/** Confirm SSR emits structure and styles without browser-only APIs. */
function verifiesServerScrollArea(): void {
  const markup = renderServerScrollArea();
  expect(markup).toContain('data-scroll-area-');
  expect(markup).toContain('data-scroll-area-viewport');
  expect(markup).toContain('data-scroll-area-content');
  expect(markup).toContain('Server scroll content');
  expect(markup).toContain('leverui-scroll-area__root');
  expect(markup).toContain('data-size="md"');
  expect(markup).toContain('data-variant="hover"');
}

test('published ScrollArea renders machine parts on the server', verifiesServerScrollArea);
