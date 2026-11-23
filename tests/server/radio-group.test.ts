import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RadioGroup as RadioGroupExport } from '../../src';

type ServerComponents = { RadioGroup: typeof RadioGroupExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Compose one radio item with its native input and visual mark. */
function renderChoice(value: string, label: string): ReturnType<typeof createComponent> {
  return createComponent(server.RadioGroup.Item, {
    value,
    /** Keep parts under the item's the primitive context. */
    get children() {
      return [
        createComponent(server.RadioGroup.ItemHiddenInput, {}),
        createComponent(server.RadioGroup.ItemIndicator, {}),
        createComponent(server.RadioGroup.ItemText, { children: label }),
      ];
    },
  });
}

/** Render machine-owned Radio Group markup without a style provider. */
function renderServerRadioGroup(): string {
  return renderToString(
    /** Establish native selection and authored CSS hooks. */
    () =>
      createComponent(server.RadioGroup.Root as Component<Record<string, unknown>>, {
        name: 'framework',
        defaultValue: 'solid',
        variant: 'solid',
        /** Put the label and item under the primitive root. */
        get children() {
          return [
            createComponent(server.RadioGroup.Label, { children: 'Framework' }),
            renderChoice('solid', 'Solid'),
          ];
        },
      }),
  );
}

/** Retain radio semantics and styling hooks in provider-free server markup. */
function verifiesServerRadioGroup(): void {
  const markup = renderServerRadioGroup();
  expect(markup).toContain('data-radio-group-');
  expect(markup).toContain('lui-radio-group__root');
  expect(markup).toContain('lui-radio-group__itemControl');
  expect(markup).toContain('type="radio"');
  expect(markup).toContain('data-state="checked"');
  expect(markup).toContain('Solid');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|variant)=/);
}

test('published Radio Group renders provider-free native selection', verifiesServerRadioGroup);
