import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Kbd as KbdExport, KbdProps, KbdPropsProvider as KbdProviderExport } from '../../src';

interface ServerComponents {
  Kbd: typeof KbdExport;
  KbdPropsProvider: typeof KbdProviderExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Verify the published server entry preserves native Kbd semantics. */
function verifiesServerKbd(): void {
  const markup = renderToString(
    /** Build the component tree without a styling provider. */
    () =>
      createComponent(server.KbdPropsProvider, {
        value: { size: 'lg', variant: 'outline', title: 'Shared key' },
        /** Render both semantic and selected native elements. */
        get children() {
          return [
            createComponent(server.Kbd, { id: 'server-kbd', children: 'Esc' }),
            createComponent(server.Kbd, {
              as: 'span',
              id: 'server-kbd-span',
              children: '⌘',
            } satisfies KbdProps<'span'>),
          ];
        },
      }),
  );

  expect(markup).toMatch(/<kbd[^>]*id="server-kbd"/);
  expect(markup).toMatch(/<span[^>]*id="server-kbd-span"/);
  expect(markup.match(/title="Shared key"/g)).toHaveLength(2);
  expect(markup).toContain('lui-kbd');
  expect(markup).not.toMatch(/\s(?:as|size|variant|unstyled)=/);
}

test('published Kbd renders semantic and selected elements', verifiesServerKbd);

/** Verify shared provider content appears separately in published server markup. */
function verifiesServerSharedChildren(): void {
  /** Construct a fresh native span for each inheriting Kbd. */
  function renderSharedKey() {
    return createComponent(Dynamic, { component: 'span', children: 'Esc' });
  }

  const markup = renderToString(
    /** Construct inherited child content without a styling provider. */
    () =>
      createComponent(server.KbdPropsProvider, {
        value: { children: renderSharedKey },
        /** Render two inherited labels and one local override. */
        get children() {
          return [
            createComponent(server.Kbd, { id: 'first-shared-key' }),
            createComponent(server.Kbd, { id: 'second-shared-key' }),
            createComponent(server.Kbd, { id: 'local-shared-key', children: 'Enter' }),
          ];
        },
      }),
  );

  expect(markup).toMatch(/<kbd[^>]*id="first-shared-key"[^>]*><span[^>]*>Esc<\/span><\/kbd>/);
  expect(markup).toMatch(/<kbd[^>]*id="second-shared-key"[^>]*><span[^>]*>Esc<\/span><\/kbd>/);
  expect(markup).toMatch(/<kbd[^>]*id="local-shared-key"[^>]*>Enter<\/kbd>/);
}

test('published Kbd renders shared children per instance', verifiesServerSharedChildren);
