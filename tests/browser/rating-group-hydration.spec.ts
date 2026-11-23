import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark one server node so replacement during hydration becomes observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/rating-group-hydration-example.tsx';
  const { hydrateRatingGroupExample } = await import(modulePath);
  const root = document.getElementById('rating-group-hydration-root');
  if (!root) throw new Error('Rating Group hydration root was not found.');
  hydrateRatingGroupExample(root);
}

/** Confirm server nodes, appearance, and machine behavior survive hydration. */
async function verifiesRatingGroupHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/rating-group-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="rating-group-hydration-root">${markup}</div>`,
  );

  const primaryRoot = page.getByTestId('primary-rating-root');
  const externalRoot = page.getByTestId('external-rating-root');
  const primary = page.getByRole('radiogroup', { name: 'Hydrated primary' });
  const external = page.getByRole('radiogroup', { name: 'Hydrated external' });
  // Zag 2 names an item holding a half value by that value.
  const primaryThird = primary.getByRole('radio', { name: '2.5 stars' });
  const externalFourth = external.getByRole('radio', { name: '4 stars' });
  const halfIndicator = primaryThird.locator('.lui-rating-group__itemIndicator');
  await expect(primaryThird).toHaveAttribute('aria-checked', 'true');
  await expect(halfIndicator).toHaveAttribute('data-half', '');
  await expect(halfIndicator.locator('svg')).toHaveCount(2);
  await expect(externalFourth).toHaveAttribute('aria-checked', 'true');
  await expect(externalRoot).toHaveClass(/inherited-rating/);
  const inheritedColor = await externalRoot.evaluate(
    /** Read CSS inherited from the props provider. */
    (element) => getComputedStyle(element).color,
  );
  expect(inheritedColor).toBe('rgb(1, 2, 3)');
  // Zag 2 gives roots no `id`; the scoped part attribute keeps the server ID.
  const originalIds = [
    await primaryRoot.getAttribute('data-rating-group-root'),
    await externalRoot.getAttribute('data-rating-group-root'),
  ];
  await primaryThird.evaluate(markServerNode);
  await halfIndicator.evaluate(markServerNode);
  await externalFourth.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record failures while the published browser package attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#rating-group-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(primaryThird).toHaveAttribute('data-server-node', 'true');
  await expect(halfIndicator).toHaveAttribute('data-server-node', 'true');
  await expect(externalFourth).toHaveAttribute('data-server-node', 'true');
  await expect(primaryRoot).toHaveAttribute('data-rating-group-root', originalIds[0] ?? '');
  await expect(externalRoot).toHaveAttribute('data-rating-group-root', originalIds[1] ?? '');
  // Click the right half: with half steps, the left half would select 3.5,
  // and Zag 2 would then name the item "3.5 stars".
  const primaryFourth = primary.getByRole('radio', { name: '4 stars' });
  const fourthBox = await primaryFourth.boundingBox();
  if (!fourthBox) throw new Error('The fourth primary star has no layout box.');
  await primaryFourth.click({ position: { x: fourthBox.width - 2, y: fourthBox.height / 2 } });
  await expect(primary.getByRole('radio', { name: '4 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await external.getByRole('radio', { name: '5 stars' }).click();
  await expect(external.getByRole('radio', { name: '5 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(
    await page.getByTestId('primary-rating-form').evaluate(
      /** Read the browser's submitted primary rating. */
      (form) => new FormData(form as HTMLFormElement).get('primary-score'),
    ),
  ).toBe('4');
  expect(
    await page.getByTestId('external-rating-form').evaluate(
      /** Read the browser's submitted external rating. */
      (form) => new FormData(form as HTMLFormElement).get('external-score'),
    ),
  ).toBe('5');
}

test('published Rating Group survives hydration in both root modes', verifiesRatingGroupHydration);
