import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderCardHydrationTree,
  type CardHydrationComponents,
} from '../../.storybook/card-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CardHydrationComponents;

/** Verify the published server entry renders Card parts and native CSS hooks. */
function verifiesServerCard(): void {
  const markup = renderToString(
    /** Use the same Card tree as the browser hydration check. */
    () => renderCardHydrationTree(server),
  );
  expect(markup).toContain('id="hydrated-card"');
  expect(markup).toContain('<h3');
  expect(markup).toContain('A card');
  expect(markup).toContain('Card details');
  expect(markup).toContain('lui-card');
  expect(markup).not.toContain(' size="sm"');
  expect(markup).not.toContain(' variant="outline"');
}

test('published Card renders native parts on the server', verifiesServerCard);
