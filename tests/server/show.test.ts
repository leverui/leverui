import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Show as ShowExport } from '../../src';

type ServerExports = { Show: typeof ShowExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render a plain child or fallback through the published server entry. */
function renderPlainShow(when: unknown): string {
  return renderToString(
    /** Keep conditional rendering inside one server request. */
    () => createComponent(server.Show, { when, fallback: 'Fallback', children: 'Content' }),
  );
}

/** Render the narrowed truthy value through the callback contract. */
function renderValue(current: Accessor<number>): JSX.Element {
  return createComponent(Dynamic, {
    component: 'output',
    /** Read the value supplied by Solid Show on the server. */
    get children() {
      return `Value: ${current()}`;
    },
  });
}

/** Verify falsy values show the fallback and truthy values show children. */
function verifiesServerTruthiness(): void {
  for (const when of [false, 0, '', null, undefined, NaN]) {
    const markup = renderPlainShow(when);
    expect(markup).toContain('Fallback');
    expect(markup).not.toContain('Content');
  }
  for (const when of [true, 1, 'ready', [], {}]) {
    const markup = renderPlainShow(when);
    expect(markup).toContain('Content');
    expect(markup).not.toContain('Fallback');
  }
}

/** Verify the render function receives the narrowed value without a wrapper. */
function verifiesServerRenderFunction(): void {
  const markup = renderToString(
    /** Render a truthy numeric value through the published component. */
    () => createComponent(server.Show, { when: 10, children: renderValue }),
  );
  expect(markup).toContain('<output');
  expect(markup).toContain('Value: 10');
  expect(markup).not.toContain('<div');
}

test('published Show uses truthy and fallback server branches', verifiesServerTruthiness);
test('published Show narrows render-function values on the server', verifiesServerRenderFunction);
