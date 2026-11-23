import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Input as InputExport, InputGroup as GroupExport } from '../../src';

type ServerComponents = {
  Input: typeof InputExport;
  InputGroup: typeof GroupExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a grouped native field through the published server entry. */
function renderServerGroup(): string {
  return renderToString(
    /** Render the composition through the published entry. */
    () =>
      createComponent(server.InputGroup, {
        id: 'server-input-group',
        startElement: 'https://',
        endAddon: 'USD',
        /** Build the field under the group's padding context. */
        get children() {
          return createComponent(server.Input, {
            'aria-label': 'Server website',
            defaultValue: 'example',
          });
        },
      }),
  );
}

/** Keep group props out of native markup while preserving input content. */
function verifiesServerGroup(): void {
  const markup = renderServerGroup();
  expect(markup).toContain('id="server-input-group"');
  expect(markup).toContain('lui-input-group');
  expect(markup).toContain('lui-input-element');
  expect(markup).toContain('lui-input-addon');
  expect(markup).toContain('value="example"');
  expect(markup).not.toMatch(/<div[^>]*\sstartElement=/);
}

test('published Input Group renders a composed native field on the server', verifiesServerGroup);

/** Render a caller-supplied field count through the published server entry. */
function renderServerChildren(content: () => JSX.Element, startElement?: JSX.Element): string {
  return renderToString(
    /** Mount the provider before resolving field children. */
    () =>
      createComponent(server.InputGroup, {
        startElement,
        /** Resolve the caller's fields inside the group. */
        get children() {
          return content();
        },
      }),
  );
}

/** Reject missing and multiple fields with the same public contract. */
function verifiesSingleChildContract(): void {
  expect(() => renderServerChildren(() => undefined)).toThrow(
    'InputGroup requires exactly one field child.',
  );
  expect(() => renderServerChildren(() => '<input>')).toThrow(
    'InputGroup requires exactly one field child.',
  );
  expect(() =>
    renderServerChildren(() => [
      createComponent(server.Input, { 'aria-label': 'First' }),
      createComponent(server.Input, { 'aria-label': 'Second' }),
    ]),
  ).toThrow('InputGroup requires exactly one field child.');
}

test('published Input Group requires one field child', verifiesSingleChildContract);

/** Keep server detection independent of DOM globals supplied by a host. */
function verifiesDomCapableServer(): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Element');
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: Array });
  try {
    expect(renderServerGroup()).toContain('aria-label="Server website"');
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'Element', descriptor);
    else Reflect.deleteProperty(globalThis, 'Element');
  }
}

test('published Input Group renders with a DOM global on the server', verifiesDomCapableServer);

/** Render the documented custom field through native CSS attributes. */
function renderCustomField(): JSX.Element {
  return createComponent(Dynamic, {
    component: 'input',
    'aria-label': 'Custom server field',
    class: 'lui-input-group__field',
    style: { height: '40px', '--lui-input-group-field-height': '40px' },
  });
}

/** Keep the group offset and custom field height in published server output. */
function verifiesCustomField(): void {
  const markup = renderServerChildren(renderCustomField, '@');
  expect(markup).toContain('aria-label="Custom server field"');
  expect(markup).toContain('lui-input-group__field');
  expect(markup).toContain('--lui-input-group-field-height:40px');
  expect(markup).toContain('--lui-private-input-group-start-offset:0px');
}

test('published Input Group renders custom field padding', verifiesCustomField);
