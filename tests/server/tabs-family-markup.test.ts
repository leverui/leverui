import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  TabsContent as ContentExport,
  TabsContentGroup as GroupExport,
  TabsList as ListExport,
  TabsRoot as RootExport,
  TabsTrigger as TriggerExport,
} from '../../src';

type ServerComponents = {
  TabsRoot: typeof RootExport;
  TabsList: typeof ListExport;
  TabsTrigger: typeof TriggerExport;
  TabsContent: typeof ContentExport;
  TabsContentGroup: typeof GroupExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the Tabs content group through the published server entry. */
function renderServerTabs(): string {
  return renderToString(
    /** Keep the primitive's machine context inside the Tabs root. */
    () =>
      createComponent(server.TabsRoot, {
        defaultValue: 'first',
        /** Render a trigger and grouped panel under the same root. */
        get children(): JSX.Element {
          return [
            createComponent(server.TabsList, {
              /** Give the tab an accessible name. */
              get children(): JSX.Element {
                return createComponent(server.TabsTrigger, {
                  value: 'first',
                  children: 'First',
                });
              },
            }),
            createComponent(server.TabsContentGroup, {
              /** Keep the panel inside the content-group part. */
              get children(): JSX.Element {
                return createComponent(server.TabsContent, {
                  value: 'first',
                  children: 'First panel',
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Confirm grouped selected content retains the primitive state and Lever UI classes. */
function verifiesServerMarkup(): void {
  const markup = renderServerTabs();
  expect(markup).toContain('lui-tabs__root');
  expect(markup).toContain('lui-tabs__contentGroup');
  expect(markup).toContain('aria-selected="true"');
  expect(markup).toContain('First panel');
}

test('published Tabs renders grouped content on the server', verifiesServerMarkup);

/** Keep finite responsive Tabs sizes in server markup for static CSS. */
function verifiesResponsiveSizeMarkup(): void {
  const markup = renderToString(
    /** Keep the published root under its required provider. */
    () =>
      createComponent(server.TabsRoot, {
        defaultValue: 'first',
        size: { base: 'sm', md: 'lg' } as const,
        fitted: { base: true, md: false } as const,
        justify: { base: 'start', md: 'end' } as const,
        variant: { base: 'subtle', md: 'plain' } as const,
        /** Keep the trigger inside its primitive root. */
        get children(): JSX.Element {
          return createComponent(server.TabsList, {
            /** Render one accessible tab. */
            get children(): JSX.Element {
              return createComponent(server.TabsTrigger, { value: 'first', children: 'First' });
            },
          });
        },
      }),
  );
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-size-md="lg"');
  expect(markup).toContain('data-fitted="true"');
  expect(markup).toContain('data-fitted-md="false"');
  expect(markup).toContain('data-justify="start"');
  expect(markup).toContain('data-justify-md="end"');
  expect(markup).toContain('data-variant="subtle"');
  expect(markup).toContain('data-variant-md="plain"');
  expect(markup).toContain('data-variant-responsive');
}

test(
  'published Tabs exposes responsive size, layout, and variant for authored CSS',
  verifiesResponsiveSizeMarkup,
);

/** Require the missing-context error to name both supported root modes. */
function verifiesMissingContextGuidance(): void {
  expect(() => renderToString(() => createComponent(server.TabsContent, { value: 'one' }))).toThrow(
    'Tabs parts must be inside TabsRoot or TabsRootProvider.',
  );
}

test('Tabs content identifies both supported root modes', verifiesMissingContextGuidance);
