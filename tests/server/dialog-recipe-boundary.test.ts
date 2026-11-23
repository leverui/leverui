import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  DialogRoot as RootExport,
  DialogRootProps,
  DialogTrigger as TriggerExport,
} from '../../src';

type ServerComponents = {
  DialogRoot: typeof RootExport;
  DialogTrigger: typeof TriggerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a public Dialog trigger through the published server entry. */
function renderDialog(size?: DialogRootProps['size']): string {
  return renderToString(
    /** Create the primitive machine with published native part hooks. */
    () =>
      createComponent(server.DialogRoot, {
        size,
        /** Require a part class during server rendering. */
        get children() {
          return createComponent(server.DialogTrigger, { children: 'Open dialog' });
        },
      }),
  );
}

/** Verify the default Dialog emits CSS hooks without a style tag. */
function verifiesDefaultBypass(): void {
  const markup = renderDialog();
  expect(markup).toContain('lui-dialog__trigger');
  expect(markup).toContain('data-lui-dialog-css');
}

/** Reflect responsive sizes in server attributes without inserting CSS. */
function verifiesResponsiveBypass(): void {
  const markup = renderDialog({ mdDown: 'full', md: 'lg' });
  expect(markup).toContain('lui-dialog__trigger');
  expect(markup).toContain('data-size-md-down="full"');
  expect(markup).toContain('data-size-md="lg"');
  expect(markup).toContain('data-lui-dialog-css');
}

test('default Dialog renders CSS hooks without inserted rules', verifiesDefaultBypass);
test('responsive Dialog renders CSS size attributes', verifiesResponsiveBypass);
