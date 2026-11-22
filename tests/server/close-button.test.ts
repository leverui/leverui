import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { CloseButton as CloseButtonExport } from '../../src';

type ServerComponents = { CloseButton: typeof CloseButtonExport };

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a Close Button on the server with the given props. */
function renderCloseButton(props: Parameters<typeof CloseButtonExport>[0]): string {
  return renderToString(
    /** Create the button inside the server render. */
    (): JSX.Element => createComponent(server.CloseButton, props),
  );
}

/** The default button has a name, a button type, and a hidden icon. */
function verifiesDefaultCloseButton(): void {
  const markup = renderCloseButton({});
  expect(markup).toMatch(/^<button[^>]*aria-label="Close"[^>]*type="button"/);
  expect(markup).toContain('class="leverui-button leverui-icon-button leverui-close-button"');
  expect(markup).toMatch(/<svg[^>]*aria-hidden="true"/);
}

/** A caller's label, size, and variant replace the defaults. */
function verifiesCloseButtonProps(): void {
  const markup = renderCloseButton({
    'aria-label': 'Dismiss alert',
    size: 'sm',
    variant: 'outline',
  });
  expect(markup).toContain('aria-label="Dismiss alert"');
  expect(markup).not.toContain('aria-label="Close"');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('data-variant="outline"');
}

test('CloseButton renders a named button on the server', verifiesDefaultCloseButton);
test('CloseButton keeps caller props on the server', verifiesCloseButtonProps);
