import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Button as ButtonExport } from '../../src';

type ServerExports = { Button: typeof ButtonExport };
const serverEntry = '../../dist/server/index.js';
const { Button } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify that an unlayered consumer token overrides the published Button. */
async function verifiesConsumerOverride({ page }: { page: Page }): Promise<void> {
  /** Render the public Button without a styling provider. */
  function renderExample() {
    return createComponent(Button, { 'data-testid': 'theme-button', children: 'Theme' });
  }

  const markup = renderToString(renderExample);
  await page.setContent(
    `<style>${defaultCss}</style><style>:root { --leverui-colors-gray-solid: rgb(98, 84, 199); }</style>${markup}`,
  );

  await expect(page.getByTestId('theme-button')).toHaveCSS('background-color', 'rgb(98, 84, 199)');
}

test('consumer CSS overrides a Lever UI token in server markup', verifiesConsumerOverride);
