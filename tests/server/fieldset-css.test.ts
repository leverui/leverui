import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Fieldset as FieldsetExport } from '../../src';

type ServerComponents = { Fieldset: typeof FieldsetExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render standalone Fieldset parts without a styling provider. */
function renderFieldset(): string {
  return renderToString(
    /** Keep the legend and description inside the primitive's native group. */
    () =>
      createComponent(server.Fieldset.Root, {
        id: 'css-only-fieldset',
        size: { base: 'sm', md: 'lg' },
        /** Include representative parts beneath the root context. */
        get children() {
          return [
            createComponent(server.Fieldset.Legend, { children: 'Account' }),
            createComponent(server.Fieldset.HelperText, { children: 'Account details' }),
            createComponent(server.Fieldset.Content, { children: 'Controls' }),
          ];
        },
      }),
  );
}

/** Verify authored CSS hooks survive SSR without presentation style tags. */
function verifiesServerCss(): void {
  const markup = renderFieldset();
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-size-md="lg"');
  expect(markup).toContain('lui-fieldset__root');
  expect(markup).toContain('lui-fieldset__legend');
  expect(markup).toContain('lui-fieldset__helperText');
  expect(markup).toContain('lui-fieldset__content');
  expect(markup).toContain('aria-labelledby="fieldset::css-only-fieldset::legend"');
  expect(markup).not.toMatch(/\s(?:css|recipe|unstyled)=/);
}

test('published Fieldset renders authored CSS hooks without inserted styles', verifiesServerCss);
