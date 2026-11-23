import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser component to the server-rendered tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/tags-input-hydration-example.tsx';
  const { hydrateTagsInputExample } = await import(modulePath);
  const root = document.getElementById('tags-input-hydration-root');
  if (!root) throw new Error('Tags Input hydration root was not found.');
  hydrateTagsInputExample(root);
}

/** Preserve tag nodes, IDs, focus, and native values after hydration. */
async function verifiesTagsInputHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/tags-input-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="tags-input-hydration-root">${markup}</div>`,
  );
  const input = page.getByPlaceholder('Add framework');
  const tags = page.locator('#tags-input-hydration-root .lui-tags-input__item');
  await expect(tags).toHaveCount(2);
  const originalInputId = await input.getAttribute('id');
  const originalLabelFor = await page.getByText('Frameworks', { exact: true }).getAttribute('for');
  await tags.first().evaluate(
    /** Mark the existing server item so DOM replacement is visible. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture hydration and subsequent interaction exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#tags-input-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(tags.first()).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveAttribute('id', originalInputId ?? '');
  await expect(page.getByText('Frameworks', { exact: true })).toHaveAttribute(
    'for',
    originalLabelFor ?? '',
  );
  await page.getByText('Frameworks', { exact: true }).click();
  await expect(input).toBeFocused();
  await input.fill('React');
  await input.press('Enter');
  await expect(tags).toHaveCount(3);
  expect(
    await page.getByTestId('hydrated-tags-form').evaluate(
      /** Read the native form value after hydration and keyboard entry. */
      (form) => new FormData(form as HTMLFormElement).get('frameworks'),
    ),
  ).toContain('React');
  expect(errors).toEqual([]);
}

test(
  'published Tags Input hydrates existing tags and accepts keyboard entry',
  verifiesTagsInputHydration,
);
