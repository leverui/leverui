import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Toggle as ToggleExport } from '../../src';

type ServerComponents = {
  Toggle: typeof ToggleExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Toggle composition through the server entry point. */
function renderServerToggle(): string {
  return renderToString(
    /** Render the primitive's machine without a styling provider. */
    () =>
      createComponent(server.Toggle.Root as Component<Record<string, unknown>>, {
        defaultPressed: true,
        'aria-label': 'Bold',
        /** Place the indicator beneath the Toggle root context. */
        get children() {
          return createComponent(server.Toggle.Indicator, {
            fallback: 'Off',
            children: 'On',
          });
        },
      }),
  );
}

/** Verify the published button's state and authored CSS hooks. */
function verifiesServerToggle(): void {
  const markup = renderServerToggle();
  expect(markup).toContain('data-toggle-');
  expect(markup).toContain('lui-toggle__root');
  expect(markup).toContain('lui-toggle__indicator');
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('type="button"');
  expect(markup).toContain('On');
}

test('published Toggle renders pressed ARIA state and indicator', verifiesServerToggle);
