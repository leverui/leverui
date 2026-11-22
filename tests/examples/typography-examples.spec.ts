import { expect, test, type Page } from '@playwright/test';

const families = {
  highlight: {
    basic: 'Thursday before noon.',
    multiple: 'on the ride.',
    'search-query': 'Desktop organizer',
    'custom-style': 'closes at 6 pm',
    squiggle: 'Accessible by default, delightful by design.',
  },
  link: {
    basic: 'Visit Lever UI',
    variants: 'Link (underline)',
    'within-text': 'Lever UI',
  },
  linkoverlay: {
    basic: 'Want to try it?',
    article: 'Lever UI theming workshop',
  },
  mark: {
    basic: 'before 2 pm',
    variants: 'before 2 pm',
  },
  text: {
    basic: 'Sphinx of black quartz',
    'as-props': 'Text rendered as',
    truncate: 'Your order has shipped',
    'line-clamp': 'Your order has shipped',
    sizes: 'Lever UI',
    weights: 'Sphinx of black quartz',
  },
} as const;

/** Require each implemented Typography story to show its content. */
async function verifiesTypographyStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  for (const [family, stories] of Object.entries(families)) {
    for (const [story, expected] of Object.entries(stories)) {
      await page.goto(`/iframe.html?id=typography-${family}--${story}`);
      await expect(page.locator('#storybook-root')).toContainText(expected, { timeout: 45_000 });
    }
  }
}

/** Check the matched terms and case-insensitive search results. */
async function verifiesHighlightMatches({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-highlight--multiple');
  await expect(page.locator('#storybook-root mark')).toHaveCount(3);
  await page.goto('/iframe.html?id=typography-highlight--search-query');
  await expect(page.locator('#storybook-root mark')).toHaveCount(3);
  await expect(page.locator('#storybook-root mark').first()).toHaveText('Desk');
  await page.goto('/iframe.html?id=typography-highlight--squiggle');
  await expect(page.locator('#storybook-root mark')).toHaveCount(1);
  await expect(page.locator('#storybook-root mark')).toHaveText('delightful by design.');
  await expect(page.locator('#storybook-root mark img')).toHaveCount(1);
  await expect(page.locator('#storybook-root mark img')).toHaveAttribute(
    'src',
    /^data:image\/svg\+xml,/,
  );
  await expect(page.locator('#storybook-root mark img')).toHaveJSProperty('naturalWidth', 580);
  await expect(page.locator('#storybook-root mark img')).toHaveJSProperty('naturalHeight', 23);
}

/** Preserve the four Mark treatments and eleven Text sizes. */
async function verifiesTypographyVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-mark--variants');
  await expect(page.locator('#storybook-root mark')).toHaveCount(4);
  await page.goto('/iframe.html?id=typography-text--sizes');
  await expect(page.locator('#storybook-root .leverui-text')).toHaveCount(11);
}

/** Keep the text truncation and line-clamp behavior. */
async function verifiesTextOverflow({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-text--truncate');
  await expect(page.locator('#storybook-root .leverui-text')).toHaveCSS(
    'text-overflow',
    'ellipsis',
  );
  await page.goto('/iframe.html?id=typography-text--line-clamp');
  await expect(page.locator('#storybook-root .leverui-text')).toHaveCSS('-webkit-line-clamp', '2');
}

/** Keep navigation semantics while using Lever UI copy and URLs. */
async function verifiesLinks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-link--basic');
  await expect(page.getByRole('link', { name: 'Visit Lever UI' })).toHaveAttribute('href', '#');
  await page.goto('/iframe.html?id=typography-link--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await expect(
    page.locator('#storybook-root tbody tr').first().locator('.leverui-link'),
  ).toHaveCount(2);
  await page.goto('/iframe.html?id=typography-link--within-text');
  await expect(page.getByRole('link', { name: 'Lever UI' })).toHaveAttribute(
    'href',
    'https://leverui.com',
  );
  await page.goto('/iframe.html?id=typography-linkoverlay--basic');
  await expect(page.getByRole('link', { name: 'Click me' })).toHaveClass(
    /leverui-linkbox__overlay/,
  );
  await page.goto('/iframe.html?id=typography-linkoverlay--article');
  await expect(page.getByRole('link', { name: 'Lever UI theming workshop' })).toHaveAttribute(
    'href',
    '#',
  );
  await expect(page.getByRole('link', { name: 'Inner link' })).toHaveAttribute(
    'href',
    '#inner-link',
  );
}

/** Let the article overlay receive body clicks while its inner link stays independent. */
async function verifiesLinkOverlayClicks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-linkoverlay--article');
  const paragraph = page.locator('#storybook-root article p');
  await expect(paragraph).toBeVisible();
  const bounds = await paragraph.boundingBox();
  if (!bounds) throw new Error('The link overlay article paragraph must be visible.');
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page).toHaveURL(/#$/);
  await page.getByRole('link', { name: 'Inner link' }).click();
  await expect(page).toHaveURL(/#inner-link$/);
}

test('all eighteen Typography examples render', verifiesTypographyStories);

/** Keep the gallery font active in public Storybook examples. */
async function verifiesGalleryFonts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-heading--basic');
  await expect(page.locator('html')).toHaveCSS('--leverui-fonts-heading', /Wix Madefor Text/);
}

test('Typography gallery keeps its font', verifiesGalleryFonts);
test('Highlight matches the search terms', verifiesHighlightMatches);
test('Mark variants and Text sizes match the counts', verifiesTypographyVariants);
test('Text truncates and clamps', verifiesTextOverflow);
test('Link and LinkOverlay preserve example destinations', verifiesLinks);
test('LinkOverlay article clicks preserve the independent inner link', verifiesLinkOverlayClicks);
