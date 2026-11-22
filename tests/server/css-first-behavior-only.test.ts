import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type * as PublicComponents from '../../src';

type ServerExports = Pick<
  typeof PublicComponents,
  | 'ClientOnly'
  | 'EnvironmentProvider'
  | 'For'
  | 'FormatByte'
  | 'FormatNumber'
  | 'LocaleProvider'
  | 'Portal'
  | 'Show'
>;

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render one native marker for a behavior-only component's content. */
function nativeSpan(id: string, label: string): JSX.Element {
  return createComponent(Dynamic, { component: 'span', id, children: label });
}

/** Render an array item without adding a Lever UI wrapper. */
function renderItem(item: string): JSX.Element {
  return nativeSpan('for-item', item);
}

/** Compose the published behavior-only families under one server request. */
function renderBehaviorOnly(): string {
  return renderToString(
    /** Keep the environment provider at the outer boundary. */
    () =>
      createComponent(server.EnvironmentProvider, {
        /** Place locale-aware descendants inside the same environment. */
        get children() {
          return createComponent(server.LocaleProvider, {
            locale: 'en-US',
            /** Render all families through the public server entry. */
            get children() {
              return createComponent(Dynamic, {
                component: 'main',
                id: 'behavior-only-root',
                /** Keep each component's native content visible for inspection. */
                get children() {
                  return [
                    createComponent(server.ClientOnly, {
                      fallback: nativeSpan('client-fallback', 'Loading'),
                      /** Defer browser-only content until a client mount. */
                      children: () => nativeSpan('client-content', 'Mounted'),
                    }),
                    createComponent(server.For, { each: ['Alpha'], children: renderItem }),
                    createComponent(server.Show, {
                      when: true,
                      children: nativeSpan('show-content', 'Shown'),
                    }),
                    createComponent(server.FormatNumber, { value: 42 }),
                    createComponent(server.FormatByte, { value: 1024 }),
                    createComponent(server.Portal, {
                      children: nativeSpan('portal-content', 'Portalled after mount'),
                    }),
                  ];
                },
              });
            },
          });
        },
      }),
  );
}

/** Assert the composed server output contains only consumer-owned markup. */
function verifiesNoPresentationRuntime(): void {
  const markup = renderBehaviorOnly();
  for (const id of ['client-fallback', 'for-item', 'show-content', 'portal-content']) {
    expect(markup).toContain(`id="${id}"`);
  }
  expect(markup).not.toContain('id="client-content"');
  expect(markup).not.toContain('<div');
  expect(markup).not.toContain('<style');
  expect(markup).toContain('42');
}

test(
  'behavior-only families emit no presentation runtime in server HTML',
  verifiesNoPresentationRuntime,
);
