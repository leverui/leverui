import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Separator as SeparatorExport, SeparatorProps } from '../../src';

type ServerComponents = {
  Separator: typeof SeparatorExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render semantic, responsive, and selected separators from the public server entry. */
function renderServerSeparators(): string {
  return renderToString(
    /** Return each separator without a presentation provider. */
    () => [
      createComponent(server.Separator, {
        id: 'server-separator',
        title: 'Section divider',
      } satisfies SeparatorProps),
      createComponent(server.Separator, {
        id: 'server-responsive-separator',
        orientation: { base: 'vertical', md: 'horizontal' },
        style: { height: '24px' },
      } satisfies SeparatorProps),
      createComponent(server.Separator, {
        as: 'div',
        id: 'server-selected-separator',
        orientation: 'vertical',
        style: { height: '24px' },
      } satisfies SeparatorProps<'div'>),
    ],
  );
}

/** Verify SSR hooks, semantics, and native element selection. */
function verifiesServerSeparator(): void {
  const markup = renderServerSeparators();
  expect(markup).toMatch(/<span[^>]*id="server-separator"/);
  expect(markup).toContain('title="Section divider"');
  expect(markup).toContain('role="separator"');
  expect(markup).toContain('aria-orientation="horizontal"');
  expect(markup).toMatch(/<span[^>]*id="server-responsive-separator"/);
  expect(markup).toContain('role="presentation"');
  expect(markup).toMatch(/<div[^>]*id="server-selected-separator"/);
  expect(markup).toContain('aria-orientation="vertical"');
  expect(markup).toContain('leverui-separator');
  expect(markup).toContain('data-size="sm"');
  expect(markup).not.toMatch(/<(?:span|div)[^>]*\s(?:size|variant|orientation|unstyled|css)=/);
}

test('published Separator renders semantic and responsive markup', verifiesServerSeparator);
