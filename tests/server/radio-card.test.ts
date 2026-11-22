import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RadioCard as RadioCardExport } from '../../src';

type ServerComponents = { RadioCard: typeof RadioCardExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Compose one selected card with its native input on the server. */
function renderCard(value: string, label: string): ReturnType<typeof createComponent> {
  return createComponent(server.RadioCard.Item, {
    value,
    /** Keep each part under the primitive item context. */
    get children() {
      return [
        createComponent(server.RadioCard.ItemHiddenInput, {}),
        createComponent(server.RadioCard.ItemControl, {
          /** Name the input and render its selected indicator. */
          get children() {
            return [
              createComponent(server.RadioCard.ItemText, { children: label }),
              createComponent(server.RadioCard.ItemIndicator, {}),
            ];
          },
        }),
      ];
    },
  });
}

/** Render both root modes without a style provider. */
function renderServerRadioCard(): string {
  return renderToString(
    /** Create both primitive machines in one Solid server owner. */
    () => {
      const external = server.RadioCard.useRadioCardGroup({ defaultValue: 'react' });
      return [
        createComponent(server.RadioCard.Root, {
          name: 'framework',
          defaultValue: 'solid',
          variant: 'solid' as const,
          /** Put the label and card under this root's the primitive context. */
          get children() {
            return [
              createComponent(server.RadioCard.Label, { children: 'Framework' }),
              renderCard('solid', 'Solid'),
            ];
          },
        }),
        createComponent(server.RadioCard.RootProvider, {
          value: external,
          /** Preserve selection in the caller-owned machine. */
          get children() {
            return renderCard('react', 'React');
          },
        }),
      ];
    },
  );
}

/** Retain radio semantics and CSS hooks in provider-free server markup. */
function verifiesServerRadioCard(): void {
  const markup = renderServerRadioCard();
  expect(markup).toContain('data-radio-group-');
  expect(markup).toContain('leverui-radio-card__root');
  expect(markup).toContain('leverui-radio-card__itemControl');
  expect(markup).toContain('type="radio"');
  expect(markup).toContain('data-state="checked"');
  expect(markup).toContain('Solid');
  expect(markup).toContain('React');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|variant)=/);
}

test('published Radio Card renders provider-free native radios', verifiesServerRadioCard);
