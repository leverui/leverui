import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Stat as StatExport } from '../../src/components/stat-exports';

type ServerComponents = {
  Stat: typeof StatExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render semantic Stat parts through the published server entry. */
function renderServerStat(): string {
  return renderToString(
    /** Create Stat parts in one server owner. */
    () =>
      createComponent(server.Stat.Root<'dl'>, {
        id: 'server-stat',
        size: 'lg',
        /** Create the label and value inside their Stat root. */
        get children() {
          return [
            createComponent(server.Stat.Label, { children: 'Visitors' }),
            createComponent(server.Stat.ValueText, {
              /** Pair a number with its muted unit. */
              get children() {
                return ['192', createComponent(server.Stat.ValueUnit, { children: 'k' })];
              },
            }),
            createComponent(server.Stat.HelpText, {
              /** Show the default trend indicator next to help text. */
              get children() {
                return [createComponent(server.Stat.UpIndicator, {}), ' this month'];
              },
            }),
          ];
        },
      }),
  );
}

/** Verify published markup, slots, trend data, and variant consumption. */
function verifiesServerStat(): void {
  const markup = renderServerStat();
  expect(markup).toMatch(/<dl[^>]*id="server-stat"/);
  expect(markup).toMatch(/<dt[^>]*>Visitors<\/dt>/);
  expect(markup).toMatch(/<dd[^>]*>/);
  expect(markup).toContain('data-type="up"');
  expect(markup).toContain('<svg');
  expect(markup).toContain('stat__valueText');
  expect(markup).toContain('data-size="lg"');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  expect(markup).not.toMatch(/<dl[^>]*\s(?:size|recipe|css|unstyled)=/);
}

test('published Stat preserves semantic parts and trend markup', verifiesServerStat);

/** Render explicit empty trend parts through the published server entry. */
function renderServerNullIndicators(): string {
  return renderToString(
    /** Render the public Stat root on the server. */
    () =>
      createComponent(server.Stat.Root<'dl'>, {
        /** Pass explicit null to each indicator. */
        get children() {
          return [
            createComponent(server.Stat.UpIndicator, { children: null }),
            createComponent(server.Stat.DownIndicator, { children: null }),
          ];
        },
      }),
  );
}

/** Verify null children do not revive default SVGs during server rendering. */
function verifiesServerNullIndicators(): void {
  const markup = renderServerNullIndicators();
  expect(markup).toContain('data-type="up"');
  expect(markup).toContain('data-type="down"');
  expect(markup).not.toContain('<svg');
}

test('published Stat honors explicit null indicator children', verifiesServerNullIndicators);
