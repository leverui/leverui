import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderDataListHydrationTree,
  type DataListHydrationComponents,
} from '../../.storybook/data-list-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as DataListHydrationComponents;

/** Verify published server output preserves native terms and descriptions. */
function verifiesServerDataList(): void {
  const markup = renderToString(
    /** Render the shared list used by the browser hydration check. */
    () => renderDataListHydrationTree(server),
  );
  expect(markup).toMatch(/<dl[^>]*id="hydrated-data-list"/);
  expect(markup).toMatch(/<div[^>]*id="hydrated-data-list-item"/);
  expect(markup).toMatch(/<dt[^>]*>Status<\/dt>/);
  expect(markup).toMatch(/<dd[^>]*id="hydrated-data-list-value"[^>]*>Pending<\/dd>/);
  expect(markup).toContain('lui-data-list__root');
  expect(markup).not.toMatch(/\s(?:orientation|size|variant)=/);
}

test('published Data List renders semantic server markup', verifiesServerDataList);
