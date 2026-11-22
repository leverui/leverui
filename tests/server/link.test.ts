import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Link as LinkExport,
  LinkBox as LinkBoxExport,
  LinkBoxProps,
  LinkOverlay as OverlayExport,
  LinkPropsProvider as PropsProviderExport,
} from '../../src';

interface ServerComponents {
  Link: typeof LinkExport;
  LinkBox: typeof LinkBoxExport;
  LinkOverlay: typeof OverlayExport;
  LinkPropsProvider: typeof PropsProviderExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Verify published server output contains native links and no recipe attributes. */
function verifiesServerLinks(): void {
  const markup = renderToString(
    /** Build all components under the published system provider. */
    () =>
      createComponent(server.LinkPropsProvider, {
        value: { variant: 'underline', title: 'Shared destination' },
        /** Render a standalone link and a separate stretched card link. */
        get children() {
          return [
            createComponent(server.Link, {
              href: '/about',
              id: 'server-link',
              children: 'About',
            }),
            createComponent(server.LinkBox, {
              as: 'article',
              id: 'server-box',
              /** Keep the overlay inside its positioned card. */
              get children() {
                return createComponent(server.LinkOverlay, {
                  href: '/article',
                  id: 'server-overlay',
                  children: 'Article',
                });
              },
            } satisfies LinkBoxProps<'article'>),
          ];
        },
      }),
  );

  expect(markup).toMatch(/<a[^>]*id="server-link"/);
  expect(markup).toContain('href="/about"');
  expect(markup).toContain('title="Shared destination"');
  expect(markup).toContain('leverui-link');
  expect(markup).toMatch(/<article[^>]*id="server-box"/);
  expect(markup).toMatch(/<a[^>]*id="server-overlay"/);
  expect(markup).toContain('leverui-linkbox__overlay');
  expect(markup).not.toMatch(/<a[^>]*\s(?:variant|as|unstyled)=/);
}

test('published Link family renders semantic navigation', verifiesServerLinks);
