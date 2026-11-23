import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { SkipNavContent as ContentExport, SkipNavLink as LinkExport } from '../../src';

type ServerComponents = {
  SkipNavContent: typeof ContentExport;
  SkipNavLink: typeof LinkExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the built server entry with a matching link and destination. */
function renderSkipNav(targetId?: string): string {
  return renderToString(
    /** Put the link before its destination without a styling provider. */
    () => [
      createComponent(server.SkipNavLink, {
        id: targetId,
        children: 'Skip to content',
      }),
      createComponent(server.SkipNavContent, {
        id: targetId,
        children: 'Main content',
      }),
    ],
  );
}

/** Verify the default target, native attributes, and Lever UI class. */
function verifiesDefaultMarkup(): void {
  const markup = renderSkipNav();
  expect(markup).toContain('href="#lui-skip-nav"');
  expect(markup).toContain('id="lui-skip-nav"');
  expect(markup).toMatch(/tabindex="-1"/i);
  expect(markup).toContain('lui-skip-nav');
}

/** Keep a consumer ID paired across both server-rendered parts. */
function verifiesCustomMarkup(): void {
  const markup = renderSkipNav('main-content');
  expect(markup).toContain('href="#main-content"');
  expect(markup).toContain('id="main-content"');
}

test('published Skip Nav renders its default target', verifiesDefaultMarkup);
test('published Skip Nav renders a custom target', verifiesCustomMarkup);
