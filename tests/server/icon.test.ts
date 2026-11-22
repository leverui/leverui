import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type * as source from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as typeof source;

/** Verify the published server API renders SVG defaults and factory paths. */
function verifiesServerIcons(): void {
  const CheckIcon = server.createIcon({ d: 'M4 12l5 5 11-11', displayName: 'CheckIcon' });
  const markup = renderToString(
    /** Compose a named Icon and a created Icon in one server request. */
    () => [
      createComponent(server.Icon, {
        id: 'server-named-icon',
        role: 'img' as const,
        'aria-label': 'Complete',
        'aria-hidden': 'false' as const,
      }),
      createComponent(CheckIcon, { id: 'server-created-icon', size: 'lg' }),
    ],
  );
  expect(markup).toMatch(/<svg[^>]*id="server-named-icon"/);
  expect(markup).toMatch(/<svg[^>]*id="server-created-icon"/);
  expect(markup).toContain('focusable="false"');
  expect(markup).toContain('aria-hidden="false"');
  expect(markup).toContain('viewBox="0 0 24 24"');
  expect(markup).toContain('d="M4 12l5 5 11-11"');
  expect(markup).not.toMatch(/<svg[^>]*\ssize=/);
}

test('published Icon renders native SVGs and created paths', verifiesServerIcons);

/** Return no custom SVG content so the factory uses its d path. */
function renderEmptyPath(): null {
  return null;
}

/** Verify published provider tags and empty-path fallback on the server. */
function verifiesServerDefaultsAndFallback(): void {
  const FallbackIcon = server.createIcon({ path: renderEmptyPath, d: 'M1 1h2v2H1z' });
  const markup = renderToString(
    /** Render inherited and explicit tags alongside a created SVG. */
    () => [
      createComponent(server.IconPropsProvider, {
        value: { as: 'span', title: 'Shared server tag' },
        /** Render a provider-selected span and an explicit SVG. */
        get children() {
          return [
            createComponent(server.Icon, { id: 'server-inherited-icon' }),
            createComponent(server.Icon, { as: 'svg' as const, id: 'server-local-icon' }),
          ];
        },
      }),
      createComponent(FallbackIcon, { id: 'server-fallback-icon' }),
    ],
  );
  expect(markup).toMatch(/<span[^>]*id="server-inherited-icon"/);
  expect(markup).toMatch(/<svg[^>]*id="server-local-icon"/);
  expect(markup.match(/title="Shared server tag"/g)).toHaveLength(2);
  expect(markup).toContain('d="M1 1h2v2H1z"');
  expect(markup).not.toMatch(/<(?:span|svg)[^>]*\sas=/);
}

test('published Icon provider tags and empty-path fallback', verifiesServerDefaultsAndFallback);
