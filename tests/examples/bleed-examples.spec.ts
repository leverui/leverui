import { expect, test, type Page } from '@playwright/test';

/** Check the two-axis and single-direction Bleed margins. */
async function verifiesBleedLayouts({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('/iframe.html?id=layout-bleed--basic');
  const basic = page.locator('#storybook-root .lui-bleed');
  await expect(basic).toHaveCount(1);
  await expect(basic).toHaveCSS('margin-left', '-40px');
  await expect(basic).toHaveCSS('margin-right', '-40px');
  await expect(basic).toHaveCSS('margin-top', '0px');
  await expect(basic).toContainText('Banner');

  // Side by side, the banner without Bleed is inset by the padding and the one with it is not.
  const cards = page.locator('#storybook-root .bleed-gallery-card');
  await expect(cards).toHaveCount(2);
  const insets: readonly number[] = [40, 0];
  for (const [index, inset] of insets.entries()) {
    const card = cards.nth(index);
    const gap = await card.evaluate(
      /** Measure the space between the card's inner edge and its banner. */
      (element) => {
        const banner = element.querySelector('.bleed-gallery-pattern');
        if (!banner) throw new Error('Banner is missing.');
        return banner.getBoundingClientRect().left - element.getBoundingClientRect().left - 1;
      },
    );
    expect(Math.round(gap)).toBe(inset);
  }

  await page.goto('/iframe.html?id=layout-bleed--vertical');
  const vertical = page.locator('#storybook-root .lui-bleed');
  await expect(vertical).toHaveCSS('margin-top', '-40px');
  await expect(vertical).toHaveCSS('margin-bottom', '-40px');
  await expect(vertical).toHaveCSS('margin-left', '0px');

  await page.goto('/iframe.html?id=layout-bleed--direction');
  const directions = page.locator('#storybook-root .lui-bleed');
  await expect(directions).toHaveCount(4);
  for (const [index, property] of [
    'margin-left',
    'margin-right',
    'margin-top',
    'margin-bottom',
  ].entries()) {
    await expect(directions.nth(index)).toHaveCSS(property, '-32px');
  }
}

/** Verify the gallery cards use overridable authored spacing without a style runtime. */
async function verifiesBleedCardCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-bleed--basic');
  const card = page.locator('#storybook-root .bleed-gallery-card').nth(1);
  await expect(card).toHaveCSS('padding-left', '40px');
  await expect(card).toHaveCSS('border-top-width', '1px');
  const pattern = card.locator('.bleed-gallery-pattern');
  await expect(pattern).toHaveCSS('height', '80px');
  await expect(pattern).toHaveCSS('background-image', /data:image\/svg\+xml/);
  await expect(pattern).not.toHaveAttribute('style');
  await page.addStyleTag({ content: '.bleed-gallery-card { --lui-spacing-10: 48px; }' });
  await expect(card).toHaveCSS('padding-left', '48px');
}

test('all three Bleed examples match offsets', verifiesBleedLayouts);
test('Bleed gallery cards use consumer-overridable CSS', verifiesBleedCardCss);
