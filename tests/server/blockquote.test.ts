import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import {
  renderBlockquoteHydrationTree,
  type BlockquoteHydrationComponents,
} from '../../.storybook/blockquote-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BlockquoteHydrationComponents;

/** Verify the published server entry emits semantic parts and authored CSS hooks. */
function verifiesServerBlockquote(): void {
  const markup = renderToString(
    /** Render the same quote tree used for browser hydration. */
    () => renderBlockquoteHydrationTree(server),
  );
  expect(markup).toContain('<figure');
  expect(markup).toContain('<blockquote');
  expect(markup).toContain('<figcaption');
  expect(markup).toContain('A quote');
  expect(markup).toContain('A writer');
  expect(markup).toContain('leverui-blockquote');
  expect(markup).toContain('data-justify="start"');
  expect(markup).toContain('data-variant="solid"');
  expect(markup).not.toMatch(/\sjustify="start"/);
  expect(markup).not.toMatch(/\svariant="solid"/);
}

test('published Blockquote renders semantic quote parts on the server', verifiesServerBlockquote);
