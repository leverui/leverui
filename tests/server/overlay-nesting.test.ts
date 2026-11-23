import { createComponent, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  DialogRoot as DialogRootExport,
  DialogTrigger as DialogTriggerExport,
  DrawerRoot as DrawerRootExport,
  DrawerTrigger as DrawerTriggerExport,
} from '../../src';

type ServerComponents = {
  DialogRoot: typeof DialogRootExport;
  DialogTrigger: typeof DialogTriggerExport;
  DrawerRoot: typeof DrawerRootExport;
  DrawerTrigger: typeof DrawerTriggerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render one overlay root inside another through the published server entry. */
function renderNested(
  Outer: Component<{ children?: JSX.Element }>,
  Inner: Component<{ children?: JSX.Element }>,
  Trigger: Component<{ children?: JSX.Element }>,
): string {
  return renderToString(
    /** Establish the package styling scope around both primitive machines. */
    () =>
      createComponent(Outer, {
        /** Let the inner overlay shadow the outer context. */
        get children() {
          return createComponent(Inner, {
            /** Render a public part under the inner machine. */
            get children() {
              return createComponent(Trigger, { children: 'Open inner overlay' });
            },
          });
        },
      }),
  );
}

/** Keep Drawer classes and authored CSS when it is nested inside Dialog. */
function verifiesDrawerInsideDialog(): void {
  const markup = renderNested(server.DialogRoot, server.DrawerRoot, server.DrawerTrigger);
  expect(markup).toContain('lui-drawer__trigger');
  expect(markup).toContain('data-lui-drawer-css');
  expect(markup).not.toContain('lui-dialog__trigger');
}

/** Keep Dialog's part hooks when it is nested inside Drawer. */
function verifiesDialogInsideDrawer(): void {
  const markup = renderNested(server.DrawerRoot, server.DialogRoot, server.DialogTrigger);
  expect(markup).toContain('lui-dialog__trigger');
  expect(markup).toContain('data-lui-dialog-css');
  expect(markup).not.toContain('lui-drawer__trigger');
}

test('Drawer shadows an outer Dialog presentation context', verifiesDrawerInsideDialog);
test('Dialog establishes its presentation inside Drawer', verifiesDialogInsideDrawer);
