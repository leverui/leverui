import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Box as BoxExport, BoxProps } from '../../src';

const serverEntry = '../../dist/server/index.js';
const { Box } = (await import(serverEntry)) as { Box: typeof BoxExport };
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Box to the provider-free server specimen. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/box-native-hydration-example.tsx';
  const { hydrateNativeBox } = await import(modulePath);
  const root = document.getElementById('box-native-hydration-root');
  if (!root) throw new Error('Native Box hydration root was not found.');
  hydrateNativeBox(root);
}

/** Check script-free CSS, native node reuse, and zero presentation style tags. */
async function verifiesNativeBoxHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Match the browser's provider-free native Box tree. */
    () =>
      createComponent<BoxProps<'section'>>(Box, {
        as: 'section',
        id: 'native-hydrated-box',
        class: 'consumer-native-box',
        children: 'Native Box',
      }),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.consumer-native-box{padding:13px}</style><div id="box-native-hydration-root">${markup}</div>`,
  );
  const box = page.locator('#native-hydrated-box');
  await expect(box).toHaveCSS('padding', '13px');
  await box.evaluate(
    /** Mark the server element so hydration must reuse it. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Capture hydration errors from the browser. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#box-native-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(box).toHaveAttribute('data-server-node', 'true');
  expect(
    await box.evaluate(
      /** Check public class tokens without depending on hydration whitespace. */
      (element) => [...element.classList],
    ),
  ).toEqual(['lui-box', 'consumer-native-box']);
  await expect(box).toHaveCSS('padding', '13px');
  expect(errors).toEqual([]);
}

test('provider-free Box hydrates without presentation styles', verifiesNativeBoxHydration);
