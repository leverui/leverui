import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Switch as SwitchExport } from '../../src';

type ServerComponents = {
  Switch: typeof SwitchExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Switch entry with a labeled native checkbox. */
function renderServerSwitch(): string {
  return renderToString(
    /** Create the primitive's Switch machine in the server owner. */
    () =>
      createComponent(server.Switch.Root as Component<Record<string, unknown>>, {
        name: 'notifications',
        value: 'yes',
        defaultChecked: true,
        /** Preserve input, default thumb, and visible label order. */
        get children() {
          return [
            createComponent(server.Switch.HiddenInput, {}),
            createComponent(server.Switch.Control, {}),
            createComponent(server.Switch.Label, { children: 'Notifications' }),
          ];
        },
      }),
  );
}

/** Preserve form semantics while consuming recipe-only props on the server. */
function verifiesServerSwitch(): void {
  const markup = renderServerSwitch();
  expect(markup).toContain('data-switch-');
  expect(markup).toContain('leverui-switch__root');
  expect(markup).toContain('leverui-switch__control');
  expect(markup).toContain('leverui-switch__thumb');
  expect(markup).toContain('type="checkbox"');
  expect(markup).toContain('name="notifications"');
  expect(markup).toContain('Notifications');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size|variant)=/);
}

test('published Switch renders its labeled native form control', verifiesServerSwitch);

/** Render both optional indicator parts from the published server entry. */
function renderServerIndicators(checked: boolean): string {
  return renderToString(
    /** Create the Switch root before reading machine state. */
    () =>
      createComponent(server.Switch.Root as Component<Record<string, unknown>>, {
        defaultChecked: checked,
        /** Render both indicator branches inside their matching parts. */
        get children() {
          return createComponent(server.Switch.Control, {
            /** Nest each indicator under the track's machine context. */
            get children() {
              return [
                createComponent(server.Switch.Indicator, {
                  children: 'Track on',
                  fallback: 'Track off',
                }),
                createComponent(server.Switch.Thumb, {
                  /** Place the thumb indicator inside the moving thumb. */
                  get children() {
                    return createComponent(server.Switch.ThumbIndicator, {
                      children: 'Thumb on',
                      fallback: 'Thumb off',
                    });
                  },
                }),
              ];
            },
          });
        },
      }),
  );
}

/** Preserve both checked and fallback indicator content during SSR. */
function verifiesServerIndicators(): void {
  const checked = renderServerIndicators(true);
  const unchecked = renderServerIndicators(false);
  expect(checked).toContain('Track on');
  expect(checked).toContain('Thumb on');
  expect(checked).not.toContain('Track off');
  expect(unchecked).toContain('Track off');
  expect(unchecked).toContain('Thumb off');
  expect(unchecked).not.toContain('Thumb on');
}

test('published Switch renders both optional indicator branches', verifiesServerIndicators);

/** Render responsive Switch choices through the published server entry. */
function renderResponsiveSwitch(): string {
  return renderToString(
    /** Create the default system scope before rendering the root. */
    () =>
      createComponent(server.Switch.Root as Component<Record<string, unknown>>, {
        size: { base: 'xs', sm: 'lg', md: 'md' },
        variant: { base: 'solid', sm: 'raised', md: 'solid' },
        /** Include a real primitive control and native checkbox. */
        get children() {
          return [
            createComponent(server.Switch.HiddenInput, {}),
            createComponent(server.Switch.Control, {}),
          ];
        },
      }),
  );
}

/** Verify server markup carries the same CSS choices as browser rendering. */
function verifiesResponsiveServerSwitch(): void {
  const markup = renderResponsiveSwitch();
  expect(markup).toContain('data-size="xs"');
  expect(markup).toContain('data-size-sm="lg"');
  expect(markup).toContain('data-size-md="md"');
  expect(markup).toContain('data-variant="solid"');
  expect(markup).toContain('data-variant-sm="raised"');
  expect(markup).toContain('data-variant-md="solid"');
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  expect(markup).toContain('type="checkbox"');
}

test(
  'published Switch renders responsive CSS choices on the server',
  verifiesResponsiveServerSwitch,
);
