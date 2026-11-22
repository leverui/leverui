import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Strong as StrongExport, StrongProps } from '../../src';

type ServerComponents = {
  Strong: typeof StrongExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render native and selected Strong elements through the published entry. */
function renderServerStrong(): string {
  return renderToString(
    /** Render native and selected elements in one server request. */
    () => [
      createComponent(server.Strong, {
        id: 'server-strong',
        title: 'Important text',
        children: 'Important',
      } satisfies StrongProps),
      createComponent(server.Strong, {
        as: 'a',
        id: 'server-strong-link',
        href: '#destination',
        children: 'Important link',
      } satisfies StrongProps<'a'>),
    ],
  );
}

/** Verify server markup keeps native semantics and stable CSS hooks. */
function verifiesServerStrong(): void {
  const markup = renderServerStrong();
  expect(markup).toMatch(/<strong[^>]*id="server-strong"/);
  expect(markup).toContain('title="Important text"');
  expect(markup).toContain('Important');
  expect(markup).toMatch(/<a[^>]*id="server-strong-link"/);
  expect(markup).toContain('href="#destination"');
  expect(markup).toContain('leverui-strong');
  expect(markup).not.toMatch(/<(?:strong|a)[^>]*\s(?:as|asChild|css|unstyled|role)=/);
}

test('published Strong renders native semantic markup', verifiesServerStrong);
