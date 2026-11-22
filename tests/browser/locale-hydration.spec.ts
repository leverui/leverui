import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type {
  LocaleProvider as LocaleProviderExport,
  useFilter as UseFilterExport,
  useLocaleContext as UseLocaleContextExport,
} from '../../src';
import { renderLocaleHydrationTree } from '../../.storybook/locale-hydration-tree';

type ServerExports = {
  LocaleProvider: typeof LocaleProviderExport;
  useFilter: typeof UseFilterExport;
  useLocaleContext: typeof UseLocaleContextExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Hydrate the published locale fixture inside Storybook's browser page. */
async function hydrateLocaleInBrowser(): Promise<void> {
  const modulePath = '/.storybook/locale-hydration-example.tsx';
  const { hydrateLocaleExample } = await import(modulePath);
  const root = document.getElementById('locale-hydration-root');
  if (!root) throw new Error('Locale hydration root was not found.');
  hydrateLocaleExample(root);
}

/** Verify locale state and server nodes survive hydration and an update. */
async function verifiesPublishedLocaleHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared fixture through the package server entry. */
    () => renderLocaleHydrationTree(components),
  );
  expect(markup).toContain('ar-EG:rtl:false');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="locale-hydration-root">${markup}</div>`,
  );
  const stable = page.getByTestId('locale-hydration-stable');
  const probe = page.getByTestId('locale-hydration-probe');
  await stable.evaluate(
    /** Mark a server sibling to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await probe.evaluate(
    /** Mark server locale output to verify hydration reuse. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Record browser exceptions raised during hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateLocaleInBrowser);
  await expect(page.locator('#locale-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  await expect(probe).toHaveAttribute('data-server-element', 'true');
  await expect(probe).toHaveText('ar-EG:rtl:false');
  await page.getByTestId('locale-hydration-toggle').click();
  await expect(probe).toHaveText('tr-TR:ltr:true');
  await expect(probe).toHaveAttribute('data-server-element', 'true');
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  expect(errors).toEqual([]);
}

test('published LocaleProvider hydrates and updates its locale', verifiesPublishedLocaleHydration);
