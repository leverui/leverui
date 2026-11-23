import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Box as BoxExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box, Theme } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const sampleCss = `
  :root { --sample-mode-color: var(--lui-colors-blue-500); --sample-border-width: 2px; }
  [data-leverui-color-mode='dark'] {
    --sample-mode-color: var(--lui-colors-red-500);
    --sample-border-width: 4px;
  }
  [data-leverui-color-mode='light'] {
    --sample-mode-color: var(--lui-colors-blue-500);
    --sample-border-width: 2px;
  }
  .mode-box {
    background-color: var(--lui-colors-bg);
    color: var(--sample-mode-color);
    border: var(--sample-border-width) solid transparent;
  }
  .brand-box { background-color: var(--lui-colors-blue-500); }
`;

/** Render one token-backed child that exposes both mode conditions. */
function renderColorBox(id: string) {
  return createComponent(Box, {
    'data-testid': id,
    class: 'mode-box',
    children: id,
  });
}

/** Build a dark, light, dark, and inherited scope tree for browser assertions. */
function renderScopes() {
  return createComponent(Theme, {
    appearance: 'dark',
    id: 'dark-scope',
    /** Put the light scope inside the outer dark scope. */
    get children() {
      return [
        renderColorBox('outer-dark'),
        createComponent(Theme, {
          appearance: 'light',
          id: 'light-scope',
          /** Put explicit dark and inherited scopes inside light. */
          get children() {
            return [
              renderColorBox('inner-light'),
              createComponent(Theme, {
                appearance: 'dark',
                hasBackground: false,
                id: 'inner-dark-scope',
                /** Supply the innermost color sample. */
                get children() {
                  return renderColorBox('inner-dark');
                },
              }),
              createComponent(Theme, {
                id: 'inherited-scope',
                /** Supply the child of an appearance-free scope. */
                get children() {
                  return renderColorBox('inherited-light');
                },
              }),
            ];
          },
        }),
      ];
    },
  });
}

/** Assert the nearest explicit mode controls semantic tokens and consumer CSS. */
async function verifiesNestedScopes({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderScopes);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${sampleCss}</style>${markup}`);

  for (const id of ['outer-dark', 'inner-dark']) {
    await expect(page.getByTestId(id)).toHaveCSS('background-color', 'rgb(9, 9, 11)');
    await expect(page.getByTestId(id)).toHaveCSS('color', 'rgb(239, 68, 68)');
    await expect(page.getByTestId(id)).toHaveCSS('border-top-width', '4px');
  }
  for (const id of ['inner-light', 'inherited-light']) {
    await expect(page.getByTestId(id)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.getByTestId(id)).toHaveCSS('color', 'rgb(59, 130, 246)');
    await expect(page.getByTestId(id)).toHaveCSS('border-top-width', '2px');
  }

  await expect(page.locator('#dark-scope')).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(page.locator('#dark-scope')).toHaveClass(/leverui-theme/);
  await expect(page.locator('#dark-scope')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(page.locator('#inner-dark-scope')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('#inherited-scope')).not.toHaveAttribute(
    'data-leverui-color-mode',
    'dark',
  );
}

test('nested Theme scopes use the nearest explicit mode', verifiesNestedScopes);

/** Verify explicit scopes resolve foundation tokens and inherited scopes accept semantic overrides. */
async function verifiesLocalOverrides({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderScopes);
  const overrides = `
    #light-scope { --lui-colors-white: rgb(203, 177, 90); }
    #inherited-scope { --lui-colors-bg: rgb(140, 160, 180); }
  `;
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>${sampleCss}</style><style>${overrides}</style>${markup}`,
  );

  await expect(page.getByTestId('inner-light')).toHaveCSS('background-color', 'rgb(203, 177, 90)');
  await expect(page.getByTestId('inherited-light')).toHaveCSS(
    'background-color',
    'rgb(140, 160, 180)',
  );
  await expect(page.getByTestId('inner-dark')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
}

test('theme scopes resolve local CSS overrides', verifiesLocalOverrides);

/** Check that a root brand token remains inherited through nested scopes. */
async function verifiesRootFoundationOverride({ page }: { page: Page }): Promise<void> {
  /** Render the same foundation token outside and inside explicit and inherited scopes. */
  function renderBrandExample() {
    return [
      createComponent(Box, { id: 'root-brand', class: 'brand-box' }),
      createComponent(Theme, {
        appearance: 'light',
        /** Supply both explicit and inherited scope samples. */
        get children() {
          return [
            createComponent(Box, { id: 'explicit-brand', class: 'brand-box' }),
            createComponent(Theme, {
              /** Supply the appearance-free scope sample. */
              get children() {
                return createComponent(Box, { id: 'inherited-brand', class: 'brand-box' });
              },
            }),
          ];
        },
      }),
    ];
  }

  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>${sampleCss}</style><style>:root { --lui-colors-blue-500: rgb(98, 84, 199); }</style>${renderToString(renderBrandExample)}`,
  );

  for (const id of ['root-brand', 'explicit-brand', 'inherited-brand']) {
    await expect(page.locator(`#${id}`)).toHaveCSS('background-color', 'rgb(98, 84, 199)');
  }
}

test(
  'root foundation overrides survive explicit and inherited scopes',
  verifiesRootFoundationOverride,
);
