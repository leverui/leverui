import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Collapsible as CollapsibleExport } from '../../src';

type ServerComponents = {
  Collapsible: typeof CollapsibleExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render public Collapsible parts from the published server entry. */
function renderServerCollapsible(open: boolean): string {
  return renderToString(
    /** Construct disclosure state without a styling provider. */
    () =>
      createComponent(server.Collapsible.Root, {
        defaultOpen: open,
        lazyMount: true,
        unmountOnExit: true,
        /** Render trigger, indicator, and content through the public bundle. */
        get children() {
          return [
            createComponent(server.Collapsible.Trigger, {
              /** Nest the indicator under the primitive's disclosure trigger. */
              get children() {
                return [
                  'Toggle server details',
                  createComponent(server.Collapsible.Indicator, { children: '›' }),
                ];
              },
            }),
            createComponent(server.Collapsible.Content, { children: 'Server details' }),
          ];
        },
      }),
  );
}

/** Verify open server markup includes accessible controls and styled slots. */
function verifiesOpenMarkup(): void {
  const markup = renderServerCollapsible(true);
  expect(markup).toContain('lui-collapsible__root');
  expect(markup).toContain('lui-collapsible__trigger');
  expect(markup).toContain('lui-collapsible__content');
  expect(markup).toContain('lui-collapsible__indicator');
  expect(markup).toContain('aria-expanded="true"');
  expect(markup).toContain('Server details');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|lazyMount|unmountOnExit)=/);
}

/** Omit closed lazy content while retaining its stable trigger. */
function verifiesClosedMarkup(): void {
  const markup = renderServerCollapsible(false);
  expect(markup).toContain('Toggle server details');
  expect(markup).toContain('aria-expanded="false"');
  expect(markup).not.toContain('Server details');
}

test('published Collapsible renders open slots on the server', verifiesOpenMarkup);
test('published Collapsible omits closed lazy content on the server', verifiesClosedMarkup);
