import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Status as StatusExport } from '../../src/components/status-exports';

type ServerComponents = {
  Status: typeof StatusExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Status through the published server entry. */
function renderServerStatus(): string {
  return renderToString(
    /** Create Status parts in one server request. */
    () =>
      createComponent(server.Status.Root<'div'>, {
        id: 'server-status',
        size: 'lg',
        colorPalette: 'green',
        /** Create the indicator only after the root provides its slots. */
        get children() {
          return [createComponent(server.Status.Indicator, {}), 'Ready'];
        },
      }),
  );
}

/** Verify published Status markup and finite CSS appearance attributes. */
function verifiesServerStatus(): void {
  const markup = renderServerStatus();
  expect(markup).toMatch(/<div[^>]*id="server-status"/);
  expect(markup).toContain('status__root');
  expect(markup).toContain('status__indicator');
  expect(markup).toContain('Ready');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('data-lui-color-palette="green"');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|recipe|css|unstyled)=/);
}

test('published Status renders native parts and CSS appearance hooks', verifiesServerStatus);
