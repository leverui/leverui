import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Accordion as AccordionExport } from '../../src';

type ServerComponents = {
  Accordion: typeof AccordionExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Compose one named item under the active Accordion context. */
function renderItem(value: string, title: string): ReturnType<typeof createComponent> {
  return createComponent(server.Accordion.Item, {
    value,
    /** Keep the trigger and panel under the primitive's item state. */
    get children() {
      return [
        createComponent(server.Accordion.ItemTrigger, {
          /** Retain the decorative default indicator next to visible text. */
          get children() {
            return [title, createComponent(server.Accordion.ItemIndicator, {})];
          },
        }),
        createComponent(server.Accordion.ItemContent, {
          /** Keep recipe padding inside the primitive's disclosure panel. */
          get children() {
            return createComponent(server.Accordion.ItemBody, { children: `${title} panel` });
          },
        }),
      ];
    },
  });
}

/** Render machine-owned and caller-owned Accordion roots through the server export. */
function renderServerAccordion(): string {
  return renderToString(
    /** Construct both primitive machines in one server request. */
    () => {
      const external = server.Accordion.useAccordion({ defaultValue: ['second'] });
      return [
        createComponent(server.Accordion.Root, {
          defaultValue: ['first'],
          variant: 'outline' as const,
          /** Render one initially expanded panel. */
          get children() {
            return renderItem('first', 'First');
          },
        }),
        createComponent(server.Accordion.RootProvider, {
          value: external,
          /** Render the caller-owned selection under the styled root. */
          get children() {
            return renderItem('second', 'Second');
          },
        }),
      ];
    },
  );
}

/** Preserve accessible disclosure markup and recipe hooks on the server. */
function verifiesServerAccordion(): void {
  const markup = renderServerAccordion();
  expect(markup.match(/data-accordion-[a-z-]+=/g)?.length).toBeGreaterThan(1);
  expect(markup).toContain('lui-accordion__root');
  expect(markup).toContain('lui-accordion__itemBody');
  expect(markup).toContain('aria-expanded="true"');
  expect(markup).toContain('role="region"');
  expect(markup).toContain('First panel');
  expect(markup).toContain('Second panel');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|variant)=/);
}

test('published Accordion keeps disclosure semantics in server markup', verifiesServerAccordion);
