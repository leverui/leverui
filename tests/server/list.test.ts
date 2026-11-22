import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderListHydrationTree,
  type ListHydrationComponents,
} from '../../.storybook/list-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ListHydrationComponents;

/** Verify published server markup preserves native lists and scoped parts. */
function verifiesServerList(): void {
  const markup = renderToString(
    /** Render the same tree used by the browser hydration check. */
    () => renderListHydrationTree(server),
  );
  expect(markup).toMatch(/<ul[^>]*id="hydrated-list"[^>]*role="list"/);
  expect(markup).toMatch(/<li[^>]*id="hydrated-list-item"/);
  expect(markup).toMatch(/<span[^>]*id="hydrated-list-indicator"/);
  expect(markup).toMatch(/<svg[^>]*id="hydrated-list-svg"/);
  expect(markup).toMatch(/<ol[^>]*id="hydrated-nested-list"/);
  expect(markup).toContain('leverui-list__item');
  expect(markup).not.toMatch(/\s(?:variant|align|as)=/);
}

test('published List renders semantic server markup', verifiesServerList);
