import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Editable as EditableExport } from '../../src';

type ServerComponents = { Editable: typeof EditableExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a responsive Editable directly from the published server entry. */
function renderEditable(): string {
  return renderToString(
    /** Keep the preview and input under one primitive machine. */
    () =>
      createComponent(server.Editable.Root<'div'>, {
        defaultValue: 'Draft',
        size: { base: 'sm', md: 'lg' },
        /** Include representative public parts in the server HTML. */
        get children() {
          return [
            createComponent(server.Editable.Preview, {}),
            createComponent(server.Editable.Input, {}),
          ];
        },
      }),
  );
}

/** Verify CSS hooks and size selectors render without a presentation style tag. */
function verifiesServerCss(): void {
  const markup = renderEditable();
  expect(markup).toContain('lui-editable__root');
  expect(markup).toContain('lui-editable__preview');
  expect(markup).toContain('lui-editable__input');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-size-md="lg"');
  expect(markup).not.toMatch(/\s(?:css|recipe|unstyled)=/);
}

test('published Editable renders authored CSS hooks without inserted styles', verifiesServerCss);
