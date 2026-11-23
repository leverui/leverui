import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { ActionBar as ActionBarExport } from '../../src';

type ServerComponents = { ActionBar: typeof ActionBarExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public Action Bar against its published server entry. */
function renderServerActionBar(open: boolean): string {
  return renderToString(
    /** Construct the primitive machine without a styling provider. */
    () =>
      createComponent(server.ActionBar.Root, {
        open,
        placement: 'bottom-end',
        /** Expose the fixed positioner and presence-controlled content. */
        get children() {
          return createComponent(server.ActionBar.Positioner, {
            /** Render an accessible selection control inside the content. */
            get children() {
              return createComponent(server.ActionBar.Content, {
                'aria-label': 'Selected actions',
                /** Render each public part through the server bundle. */
                get children() {
                  return [
                    createComponent(server.ActionBar.SelectionTrigger, { children: '2 selected' }),
                    createComponent(server.ActionBar.Separator, {}),
                    createComponent(server.ActionBar.CloseTrigger, {
                      'aria-label': 'Close actions',
                      children: 'Close',
                    }),
                  ];
                },
              });
            },
          });
        },
      }),
  );
}

/** Verify open server markup exposes native part hooks and no recipe props. */
function verifiesOpenServerActionBar(): void {
  const markup = renderServerActionBar(true);
  expect(markup).toContain('lui-action-bar__positioner');
  expect(markup).toContain('data-placement="bottom-end"');
  expect(markup).toContain('lui-action-bar__content');
  expect(markup).toContain('lui-action-bar__selectionTrigger');
  expect(markup).toContain('lui-action-bar__separator');
  expect(markup).toContain('2 selected');
  expect(markup).toContain('type="button"');
}

/** Keep lazily mounted content out of closed server markup. */
function verifiesClosedServerActionBar(): void {
  const markup = renderServerActionBar(false);
  expect(markup).toContain('lui-action-bar__positioner');
  expect(markup).not.toContain('2 selected');
}

test('published Action Bar renders its open parts on the server', verifiesOpenServerActionBar);
test(
  'published Action Bar lazily omits closed content on the server',
  verifiesClosedServerActionBar,
);
