import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { InputElement as ElementExport } from '../../src';

type ServerComponents = {
  InputElement: typeof ElementExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Input Element through the published server entry. */
function renderServerElement(): string {
  return renderToString(
    /** Establish the same provider available to consumer apps. */
    () =>
      createComponent(server.InputElement, {
        id: 'server-input-element',
        placement: 'end' as const,
        children: 'kg',
      }),
  );
}

/** Preserve native markup without leaking the recipe placement prop. */
function verifiesServerElement(): void {
  const markup = renderServerElement();
  expect(markup).toContain('id="server-input-element"');
  expect(markup).toContain('lui-input-element');
  expect(markup).toContain('kg');
  expect(markup).not.toMatch(/<div[^>]*\splacement=/);
}

test('published Input Element renders a native server adornment', verifiesServerElement);
