import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { VisuallyHidden as VisuallyHiddenExport, VisuallyHiddenProps } from '../../src';

type ServerExports = {
  VisuallyHidden: typeof VisuallyHiddenExport;
};
type GetChildProps = Parameters<NonNullable<VisuallyHiddenProps['asChild']>>[0];

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render the hidden span through the published server entry. */
function renderHiddenSpan(): string {
  return renderToString(
    /** Render accessible text without a styling provider. */
    () =>
      createComponent(server.VisuallyHidden, {
        id: 'server-hidden',
        children: 'Accessible text',
      }),
  );
}

/** Render a native input with the supplied hidden attributes. */
function renderHiddenInput(getProps: GetChildProps): JSX.Element {
  return createComponent(Dynamic, {
    component: 'input',
    ...getProps({ 'aria-label': 'Hidden search' }),
    type: 'text',
    id: 'server-hidden-input',
  });
}

/** Render the input composition through the published entry. */
function renderChildInput(): string {
  return renderToString(
    /** Let the child path render an input rather than a wrapper span. */
    () =>
      createComponent(server.VisuallyHidden, {
        asChild: renderHiddenInput,
        'data-parent': 'hidden',
      }),
  );
}

/** Confirm authored-CSS output preserves accessible server content. */
function verifiesServerHiddenContent(): void {
  expect('visuallyHiddenStyle' in server).toBe(false);
  const span = renderHiddenSpan();
  expect(span).toContain('Accessible text');
  expect(span).toMatch(/<span[^>]*id="server-hidden"/);
  expect(span).toContain('leverui-visually-hidden');
  expect(span).not.toMatch(/style="[^"]*clip/);
  expect(span).not.toMatch(/<span[^>]*\s(?:aria-hidden|hidden)(?:=|\s|>)/);

  const input = renderChildInput();
  expect(input).toMatch(/<input[^>]*id="server-hidden-input"/);
  expect(input).toContain('data-parent="hidden"');
  expect(input).toContain('aria-label="Hidden search"');
  expect(input).toContain('leverui-visually-hidden');
  expect(input).not.toContain('<span');
}

test(
  'published VisuallyHidden preserves text and child input on the server',
  verifiesServerHiddenContent,
);
