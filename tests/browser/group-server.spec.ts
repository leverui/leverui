import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type {
  Button as ButtonExport,
  ButtonGroup as ButtonGroupExport,
  Group as GroupExport,
} from '../../src';

type ServerExports = {
  Button: typeof ButtonExport;
  ButtonGroup: typeof ButtonGroupExport;
  Group: typeof GroupExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, ButtonGroup, Group } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render published Group variants without a browser DOM. */
function renderServerGroup(): JSX.Element {
  return [
    createComponent(Group, {
      id: 'server-group-default',
      /** Keep both children eligible for a default stacking check. */
      get children() {
        return [
          createComponent(Dynamic, { component: 'button', children: 'Default first' }),
          createComponent(Dynamic, { component: 'button', children: 'Default last' }),
        ];
      },
    }),
    createComponent(Group, {
      id: 'server-group-attached',
      orientation: 'vertical' as const,
      attached: true,
      /** Render native children without a Solid-only wrapper. */
      get children() {
        return [
          createComponent(Dynamic, { component: 'button', children: 'First' }),
          createComponent(Dynamic, { component: 'button', children: 'Last' }),
        ];
      },
    }),
    createComponent(Group, {
      id: 'server-group-responsive',
      orientation: { base: 'horizontal', md: 'vertical' } as const,
      grow: { base: false, md: true },
      children: 'Responsive group',
    }),
    createComponent(ButtonGroup, {
      id: 'server-button-group',
      class: 'consumer-button-group',
      attached: true,
      variant: 'outline' as const,
      /** Preserve two native Buttons in the static group markup. */
      get children() {
        return [
          createComponent(Button, { children: 'First action' }),
          createComponent(Button, { children: 'Last action' }),
        ];
      },
    }),
    createComponent(ButtonGroup, {
      id: 'server-button-group-responsive',
      orientation: { base: 'horizontal', md: 'vertical' } as const,
      attached: { base: true, md: false },
      /** Keep authored edges observable across a detached breakpoint. */
      get children() {
        return [
          createComponent(Button, { children: 'Start' }),
          createComponent(Button, { children: 'End' }),
        ];
      },
    }),
  ];
}

/** Measure published server layout before any Solid browser effects run. */
async function verifiesServerGroup({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerGroup);
  expect(markup).toContain('Responsive group');
  expect(markup).not.toMatch(/<style[^>]*>[^<]+<\/style>/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:orientation|attached|grow|skip|css)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const defaultGroup = page.locator('#server-group-default');
  const attached = page.locator('#server-group-attached');
  const responsive = page.locator('#server-group-responsive');
  const buttonGroup = page.locator('#server-button-group');
  const responsiveButtonGroup = page.locator('#server-button-group-responsive');
  await expect(defaultGroup).not.toHaveAttribute('data-stacking');
  await expect(defaultGroup.locator('button').first()).toHaveCSS('z-index', 'auto');
  await expect(defaultGroup.locator('button').last()).toHaveCSS('z-index', 'auto');
  await expect(attached).toHaveAttribute('data-orientation', 'vertical');
  await expect(attached).toHaveCSS('display', 'inline-flex');
  await expect(attached).toHaveCSS('flex-direction', 'column');
  await expect(attached).toHaveCSS('gap', '0px');
  await expect(attached.locator('button').first()).toHaveCSS('border-bottom-left-radius', '0px');
  await expect(responsive).toHaveCSS('display', 'inline-flex');
  await expect(responsive).toHaveAttribute('data-orientation-md', 'vertical');
  await expect(responsive).toHaveAttribute('data-grow-md', 'true');
  await expect(responsive).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(responsive).toHaveCSS('flex-direction', 'row');
  await expect(buttonGroup).toHaveClass(/leverui-button-group/);
  await expect(buttonGroup).toHaveAttribute('data-attached', '');
  await expect(buttonGroup).toHaveCSS('gap', '0px');
  await expect(responsiveButtonGroup).toHaveCSS('flex-direction', 'row');
  await expect(responsiveButtonGroup).toHaveCSS('gap', '0px');
  await expect(responsiveButtonGroup.locator('button').first()).toHaveCSS(
    'border-top-right-radius',
    '0px',
  );
  await expect(buttonGroup.getByRole('button', { name: 'First action' })).toHaveCSS(
    'border-top-right-radius',
    '0px',
  );
  await page.addStyleTag({ content: '.consumer-button-group { gap: 11px; }' });
  await expect(buttonGroup).toHaveCSS('gap', '11px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('display', 'flex');
  await expect(responsive).toHaveCSS('flex-direction', 'column');
  await expect(responsiveButtonGroup).toHaveCSS('flex-direction', 'column');
  await expect(responsiveButtonGroup).toHaveCSS('gap', '8px');
  await expect(responsiveButtonGroup.locator('button').first()).not.toHaveCSS(
    'border-top-right-radius',
    '0px',
  );
}

test('published Group preserves attached and responsive server layout', verifiesServerGroup);
