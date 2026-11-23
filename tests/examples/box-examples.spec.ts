import { expect, test, type Page } from '@playwright/test';

const stories = ['basic', 'as-prop', 'text-style', 'composition'];

/** Ensure every Box composition mounts in the gallery. */
async function verifiesBoxGallery({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=layout-box--${story}`);
    await expect(page.locator('#storybook-root > div')).toBeVisible();
  }

  await page.goto('/iframe.html?id=layout-box--as-prop');
  const section = page.locator('#storybook-root section.lui-box');
  await expect(section).toContainText('This Box renders as a section element.');
  await expect(section.getByRole('heading', { name: 'Shipping' })).toBeVisible();

  await page.goto('/iframe.html?id=layout-box--text-style');
  const styled = page.locator('#storybook-root .box-example-panel');
  await expect(styled).toHaveAttribute('data-text-style', 'lg');
  await expect(styled).toHaveCSS('font-size', '18px');
  await page.goto('/iframe.html?id=layout-box--composition');
  await expect(
    page.getByAltText('Modern single-storey home with a pool and patio'),
  ).toHaveAttribute('src', '/demo-images/scenes/home-beach-studio.webp');
  const star = page.locator('#storybook-root svg.box-property-star');
  await expect(star).toHaveCount(1);
  await expect(star).toHaveClass(/box-property-star/);
  await expect(star).toHaveCSS('color', 'rgb(251, 146, 60)');
}

test('all Box stories render their content', verifiesBoxGallery);

/** Verify the two shared Storybook insets use authored CSS on native Box elements. */
async function verifiesStoryInsets({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-box--basic');
  const layout = page.locator('#storybook-root > .example-layout-inset');
  await expect(layout).toHaveCSS('padding', '16px');
  await expect(layout).toHaveClass('lui-box example-layout-inset');
  await expect(page.locator('.box-example-panel')).toHaveClass('lui-box box-example-panel');

  await page.goto('/iframe.html?id=components-button--basic');
  const component = page.locator('#storybook-root > .example-component-inset');
  await expect(component).toHaveCSS('padding', '40px');
  await expect(component).toHaveClass('lui-box example-component-inset');
}

test('shared Storybook insets render through native Box and CSS', verifiesStoryInsets);
