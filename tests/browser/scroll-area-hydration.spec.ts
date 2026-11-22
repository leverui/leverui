import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser package to the server-rendered scroll area. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/scroll-area-hydration-example.tsx';
  const { hydrateScrollAreaExample } = await import(modulePath);
  const host = document.getElementById('scroll-area-hydration-root');
  if (!host) throw new Error('ScrollArea hydration host was not found.');
  hydrateScrollAreaExample(host);
}

/** Keep the server viewport and static styles while activating native scrolling. */
async function verifiesScrollAreaHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/scroll-area-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="scroll-area-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#scroll-area-hydration-root');
  const viewport = host.getByTestId('hydrated-scroll-viewport');
  await expect(viewport).toContainText('Hydrated row 20');
  await viewport.evaluate(
    /** Mark the server node so replacement cannot pass unnoticed. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await expect(host.getByTestId('hydrated-scrollbar')).toHaveCSS('width', '8px');
  const errors: string[] = [];

  /** Collect browser exceptions during hydration and scrolling. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(viewport).toHaveAttribute('data-server-node', 'true');
  await expect(host.getByTestId('hydrated-scrollbar')).toHaveAttribute('data-overflow-y', '');
  await viewport.hover();
  await page.mouse.wheel(0, 160);
  await expect
    .poll(
      /** Wait for scrolling after hydration to change the native viewport. */
      () =>
        viewport.evaluate(
          /** Read the hydrated viewport's current vertical position. */
          (element) => element.scrollTop,
        ),
    )
    .toBeGreaterThan(0);
  expect(errors).toEqual([]);
}

test('published ScrollArea hydrates without replacing its viewport', verifiesScrollAreaHydration);
