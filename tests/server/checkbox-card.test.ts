import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { CheckboxCard as CardExport } from '../../src';

type ServerComponents = {
  CheckboxCard: typeof CardExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public card parts under one server-side Checkbox machine. */
function renderCardParts() {
  return [
    createComponent(server.CheckboxCard.HiddenInput, {}),
    createComponent(server.CheckboxCard.Control, {
      /** Keep the label, description, and mark under the primitive's provider. */
      get children() {
        return [
          createComponent(server.CheckboxCard.Content, {
            /** Put text within the same card control. */
            get children() {
              return [
                createComponent(server.CheckboxCard.Label, { children: 'Server card' }),
                createComponent(server.CheckboxCard.Description, { children: 'Saved choice' }),
              ];
            },
          }),
          createComponent(server.CheckboxCard.Indicator, {}),
        ];
      },
    }),
    createComponent(server.CheckboxCard.Addon, { children: 'Extra information' }),
  ];
}

/** Render the published card root and external store on the server. */
function renderServerCards(): string {
  return renderToString(
    /** Establish the style and machine owner for both roots. */
    () => {
      const external = server.CheckboxCard.useCheckboxCard({
        defaultChecked: true,
        name: 'external',
      });
      return [
        createComponent(server.CheckboxCard.Root, {
          name: 'saved',
          value: 'yes',
          defaultChecked: true,
          /** Render the native input and visible card parts. */
          get children() {
            return renderCardParts();
          },
        }),
        createComponent(server.CheckboxCard.RootProvider, {
          value: external,
          /** Render a second input from the caller-owned machine. */
          get children() {
            return [
              createComponent(server.CheckboxCard.HiddenInput, {}),
              createComponent(server.CheckboxCard.Control, {
                /** Name the external card through the primitive Label. */
                get children() {
                  return createComponent(server.CheckboxCard.Label, {
                    children: 'External card',
                  });
                },
              }),
            ];
          },
        }),
      ];
    },
  );
}

/** Keep card state, semantics, and recipe hooks in published HTML. */
function verifiesServerCards(): void {
  const markup = renderServerCards();
  expect(markup).toContain('name="saved"');
  expect(markup).toContain('name="external"');
  expect(markup).toContain('leverui-checkbox-card__control');
  expect(markup).toContain('leverui-checkbox-card__description');
  expect(markup).toContain('data-checkbox-card-');
  expect(markup).toContain('data-state="checked"');
  expect(markup).not.toMatch(/\s(?:defaultChecked|size|variant|recipe)=/);
}

test('published Checkbox Card roots render native inputs and card parts', verifiesServerCards);
