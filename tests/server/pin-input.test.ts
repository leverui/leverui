import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { PinInput as PinInputExport } from '../../src';

type ServerComponents = {
  PinInput: typeof PinInputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Pin Input through the server package entry. */
function renderServerPinInput(mask = false): string {
  return renderToString(
    /** Construct provider context before the primitive machine. */
    () =>
      createComponent(server.PinInput.Root, {
        count: 4,
        name: 'code',
        mask,
        defaultValue: ['1', '2', '', ''],
        /** Render native form and visible code fields. */
        get children() {
          return [
            createComponent(server.PinInput.Label, { children: 'Verification code' }),
            createComponent(server.PinInput.HiddenInput, {}),
            createComponent(server.PinInput.Control, {
              /** Give every segment its own stable index. */
              get children() {
                return [0, 1, 2, 3].map(
                  /** Render one indexed field without a client-only branch. */
                  (index) => createComponent(server.PinInput.Input, { index }),
                );
              },
            }),
          ];
        },
      }),
  );
}

/** Check server-side form semantics and Lever UI slot classes. */
function verifiesServerPinInput(): void {
  const markup = renderServerPinInput();
  expect(markup).toContain('data-pin-input-');
  expect(markup).toContain('lui-pin-input__root');
  expect(markup).toContain('lui-pin-input__input');
  expect(markup).toContain('lui-input');
  expect(markup).toContain('data-size="md"');
  expect(markup).toContain('data-variant="outline"');
  expect(markup).toContain('name="code"');
  expect(markup).toContain('Verification code');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size)=/);
}

test('published Pin Input renders indexed form fields', verifiesServerPinInput);

/** Keep the masking option on Zag's machine through the styling adapter. */
function verifiesMaskedServerPinInput(): void {
  const markup = renderServerPinInput(true);
  expect(markup).toMatch(/<input[^>]*data-pin-input-input[^>]*type="password"/);
  expect(markup).not.toContain('mask:true');
}

test('published Pin Input masks visible fields', verifiesMaskedServerPinInput);

/** Prove a responsive Pin Input renders without a style provider or stylesheet tag. */
function verifiesProviderFreePinInput(): void {
  const markup = renderToString(
    /** Keep the primitive machine and visible field under one server owner. */
    () =>
      createComponent(server.PinInput.Root, {
        count: 2,
        size: { base: 'xs', md: 'lg' } as const,
        attached: { base: true, md: false } as const,
        /** Render a visible indexed field through its public part. */
        get children() {
          return createComponent(server.PinInput.Control, {
            /** Keep the input in the native control. */
            get children() {
              return createComponent(server.PinInput.Input, { index: 0 });
            },
          });
        },
      }),
  );
  expect(markup).toContain('data-size-md="lg"');
  expect(markup).toContain('data-attached-md="false"');
  expect(markup).toContain('lui-input');
}

test('published Pin Input needs no style provider for static CSS', verifiesProviderFreePinInput);
