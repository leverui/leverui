import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Alert as AlertExport } from '../../src';

type ServerComponents = {
  Alert: typeof AlertExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Alert through the published server entry. */
function renderServerAlert(): string {
  return renderToString(
    /** Construct the published Alert without a styling provider. */
    () =>
      createComponent(server.Alert.Root, {
        id: 'server-alert',
        status: 'warning' as const,
        size: 'lg' as const,
        role: 'alert' as const,
        /** Create compound parts inside the root's status scope. */
        get children() {
          return [
            createComponent(server.Alert.Indicator, {}),
            createComponent(server.Alert.Content, {
              /** Render the label inside the content part. */
              get children() {
                return createComponent(server.Alert.Title, { children: 'Caution' });
              },
            }),
          ];
        },
      }),
  );
}

/** Verify server markup preserves roles while consuming recipe props. */
function verifiesServerAlert(): void {
  const markup = renderServerAlert();
  expect(markup).toMatch(/<div[^>]*id="server-alert"/);
  expect(markup).toContain('role="alert"');
  expect(markup).toContain('alert__indicator');
  expect(markup).toContain('alert__title');
  expect(markup).toContain('Caution');
  expect(markup).not.toMatch(/<div[^>]*\s(?:status|size|recipe|css|unstyled)=/);
}

test('published Alert renders compound parts and consumes variants', verifiesServerAlert);
