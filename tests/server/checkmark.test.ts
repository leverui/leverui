import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Checkmark as CheckmarkExport } from '../../src';

type ServerComponents = {
  Checkmark: typeof CheckmarkExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render three Checkmark states through the published server entry. */
function renderServerCheckmarks(): string {
  return renderToString(
    /** Establish the public system before mounting recipe styled SVGs. */
    () => [
      createComponent(server.Checkmark, { id: 'server-unchecked' }),
      createComponent(server.Checkmark, {
        id: 'server-checked',
        checked: true,
        variant: 'outline' as const,
        size: 'lg' as const,
      }),
      createComponent(server.Checkmark, {
        id: 'server-indeterminate',
        checked: true,
        indeterminate: true,
        disabled: true,
      }),
    ],
  );
}

/** Verify server SVG states, glyphs, and recipe prop consumption. */
function verifiesServerCheckmark(): void {
  const markup = renderServerCheckmarks();
  expect(markup).toMatch(/<svg[^>]*id="server-unchecked"/);
  expect(markup).toContain('data-state="unchecked"');
  expect(markup).toContain('data-state="checked"');
  expect(markup).toContain('data-state="indeterminate"');
  expect(markup).toMatch(/\sdata\-disabled(?:=""|(?=[\s/>]))/);
  expect(markup).toMatch(/<polyline[^>]*points="20 6 9 17 4 12"/);
  expect(markup).toMatch(/<path[^>]*d="M5 12h14"/);
  expect(markup).not.toMatch(/<svg[^>]*\s(?:checked|indeterminate|disabled|size|variant)=/);
}

test('published Checkmark renders SVG state and CSS hooks', verifiesServerCheckmark);
