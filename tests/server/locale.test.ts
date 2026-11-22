import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  LocaleProvider as LocaleProviderExport,
  useFilter as UseFilterExport,
  useLocaleContext as UseLocaleContextExport,
} from '../../src';

type ServerExports = {
  LocaleProvider: typeof LocaleProviderExport;
  useFilter: typeof UseFilterExport;
  useLocaleContext: typeof UseLocaleContextExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render context and filtering through the published server entry. */
function LocaleProbe(): JSX.Element {
  const context = server.useLocaleContext();
  const filter = server.useFilter({ sensitivity: 'base' });
  return createComponent(Dynamic, {
    component: 'output',
    'data-locale': context().locale,
    'data-dir': context().dir,
    'data-matches': String(filter().startsWith('I', 'ı')),
  });
}

/** Render one independent server request with an optional locale scope. */
function renderLocale(locale?: string): string {
  if (!locale) return renderToString(LocaleProbe);
  return renderToString(
    /** Construct the provider and probe inside one Solid server owner. */
    () =>
      createComponent(server.LocaleProvider, {
        locale,
        /** Keep the probe inside the provider's context. */
        get children() {
          return createComponent(LocaleProbe, {});
        },
      }),
  );
}

/** Verify independent server requests do not retain locale state. */
function verifiesServerLocale(): void {
  expect(renderLocale()).toContain('data-locale="en-US"');
  expect(renderLocale('ar-EG')).toContain('data-dir="rtl"');
  expect(renderLocale('tr-TR')).toContain('data-matches="true"');
  expect(renderLocale()).toContain('data-dir="ltr"');
  expect(renderLocale()).toContain('data-matches="false"');
}

test('published locale state is scoped to each server request', verifiesServerLocale);
