import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Radiomark as RadiomarkExport } from '../../src';

type ServerComponents = {
  Radiomark: typeof RadiomarkExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Radiomark states through the published server entry. */
function renderServerRadiomarks(): string {
  return renderToString(
    /** Establish the public style system before rendering stateful marks. */
    () => [
      createComponent(server.Radiomark, { id: 'server-unchecked' }),
      createComponent(server.Radiomark, {
        id: 'server-checked',
        checked: true,
        disabled: true,
        variant: 'outline' as const,
        size: 'lg' as const,
        children: 'Selected',
      }),
    ],
  );
}

/** Verify SSR state, dot content, and recipe prop consumption. */
function verifiesServerRadiomark(): void {
  const markup = renderServerRadiomarks();
  expect(markup).toMatch(/<span[^>]*id="server-unchecked"/);
  expect(markup).toMatch(/<span[^>]*id="server-checked"/);
  expect(markup).toMatch(/\sdata\-checked(?:=""|(?=[\s/>]))/);
  expect(markup).toMatch(/\sdata\-disabled(?:=""|(?=[\s/>]))/);
  expect(markup).toMatch(/<span[^>]*class="dot lui-radiomark__dot"[^>]*><\/span><\/span>/);
  expect(markup).not.toContain('Selected');
  expect(markup).toContain('lui-radiomark');
  expect(markup).not.toMatch(/<span[^>]*\s(?:checked|disabled|size|variant)=/);
}

test('published Radiomark renders visual states and CSS hooks', verifiesServerRadiomark);
