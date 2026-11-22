import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  DialogContent as ContentExport,
  DialogDescription as DescriptionExport,
  DialogPositioner as PositionerExport,
  DialogRoot as RootExport,
  DialogTitle as TitleExport,
} from '../../src';

type ServerComponents = {
  DialogContent: typeof ContentExport;
  DialogDescription: typeof DescriptionExport;
  DialogPositioner: typeof PositionerExport;
  DialogRoot: typeof RootExport;
  DialogTitle: typeof TitleExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render an initially open Dialog through the published server entry. */
function renderOpenDialog(): string {
  return renderToString(
    /** Establish styling and primitive state before creating public parts. */
    () =>
      createComponent(server.DialogRoot, {
        defaultOpen: true,
        /** Render default content and description elements. */
        get children() {
          return createComponent(server.DialogPositioner, {
            /** Keep content under the primitive's presence context. */
            get children() {
              return createComponent(server.DialogContent, {
                /** Give the Dialog an accessible name and description. */
                get children() {
                  return [
                    createComponent(server.DialogTitle, { children: 'Server Dialog' }),
                    createComponent(server.DialogDescription, { children: 'Server summary' }),
                  ];
                },
              });
            },
          });
        },
      }),
  );
}

/** Check the native tag emitted for each Dialog part. */
function verifiesDialogNativeTags(): void {
  const markup = renderOpenDialog();
  expect(markup).toMatch(/<div\b[^>]*leverui-dialog__content/);
  expect(markup).toMatch(/<div\b[^>]*leverui-dialog__description/);
  expect(markup).not.toMatch(/<(?:section|p)\b[^>]*leverui-dialog__(?:content|description)/);
  expect(markup).toContain('role="dialog"');
  expect(markup).toContain('Server summary');
}

test('published Dialog uses native div content and description', verifiesDialogNativeTags);
