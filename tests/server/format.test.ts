import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  FormatByte as FormatByteExport,
  FormatNumber as FormatNumberExport,
  LocaleProvider as LocaleProviderExport,
} from '../../src';

type ServerExports = {
  FormatByte: typeof FormatByteExport;
  FormatNumber: typeof FormatNumberExport;
  LocaleProvider: typeof LocaleProviderExport;
};

const serverEntry = '../../dist/server/index.js';
/** Assume the emitted server entry matches source types; this test calls each export. */
const server = (await import(serverEntry)) as ServerExports;

/** Render published formatters in one isolated server locale scope. */
function renderFormat(locale: string, value: number): string {
  return renderToString(
    /** Provide the chosen locale to both text-only formatters. */
    () =>
      createComponent(server.LocaleProvider, {
        locale,
        /** Render both values without a component-owned element. */
        get children() {
          return [
            createComponent(server.FormatNumber, { value }),
            '|',
            createComponent(server.FormatByte, { value }),
          ];
        },
      }),
  );
}

/** Check published SSR output and independent locale requests. */
function verifiesServerFormat(): void {
  const en = renderFormat('en-US', 1450.45);
  const de = renderFormat('de-DE', 1450.45);
  expect(en).toContain(new Intl.NumberFormat('en-US').format(1450.45));
  expect(de).toContain(new Intl.NumberFormat('de-DE').format(1450.45));
  expect(en).toContain(
    new Intl.NumberFormat('en-US', { style: 'unit', unit: 'kilobyte' }).format(1.45),
  );
  expect(de).toContain(
    new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'kilobyte' }).format(1.45),
  );
  expect(en).not.toContain('<span');
  expect(renderFormat('en-US', 1450.45)).toBe(en);
}

test('published formatters render text in each server locale', verifiesServerFormat);
