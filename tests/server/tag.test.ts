import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { TagCloseTrigger as CloseExport } from '../../src/components/tag-close-trigger';
import type {
  TagEndElement as EndExport,
  TagLabel as LabelExport,
  TagStartElement as StartExport,
} from '../../src/components/tag-parts';
import type { TagRoot as RootExport } from '../../src/components/tag-root';

type ServerComponents = {
  TagRoot: typeof RootExport;
  TagLabel: typeof LabelExport;
  TagStartElement: typeof StartExport;
  TagEndElement: typeof EndExport;
  TagCloseTrigger: typeof CloseExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Tag family through its server entry. */
function renderServerTag(): string {
  return renderToString(
    /** Construct the Tag parts beneath their public root. */
    () =>
      createComponent(server.TagRoot<'div'>, {
        id: 'server-tag',
        title: 'Category',
        size: 'sm',
        variant: 'solid',
        /** Render the icon, label, and close control inside Tag context. */
        get children() {
          return [
            createComponent(server.TagStartElement, { children: '★' }),
            createComponent(server.TagLabel, { children: 'Featured' }),
            createComponent(server.TagEndElement, {
              /** Use the published default close icon and button type. */
              get children() {
                return createComponent(server.TagCloseTrigger, {});
              },
            }),
          ];
        },
      }),
  );
}

/** Verify native markup, defaults, and finite CSS hooks in published SSR. */
function verifiesServerTag(): void {
  const markup = renderServerTag();
  expect(markup).toMatch(/<div[^>]*id="server-tag"/);
  expect(markup).toContain('title="Category"');
  expect(markup).toMatch(/<span[^>]*>Featured<\/span>/);
  expect(markup).toMatch(/<button[^>]*type="button"/);
  expect(markup).toMatch(/<button[^>]*aria-label="Close"/);
  expect(markup).toContain('aria-hidden="true"');
  expect(markup).toContain('leverui-tag__closeTrigger');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-variant="solid"');
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  expect(markup).not.toContain('--leverui-private-tag-element-size');
  expect(markup).not.toMatch(/--tag-(?:avatar-size|element-size|element-offset)/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|variant|recipe|css|unstyled)=/);
}

test('published Tag renders native parts and a named close button', verifiesServerTag);
