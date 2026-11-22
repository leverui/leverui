import { expect, test, type Page } from '@playwright/test';

/** Open a Tokens example in Storybook's canvas iframe. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=foundations-tokens--${id}`);
  await expect(page.locator('#storybook-root')).toBeVisible();
}

/** Verify the animation control updates the actual specimen style. */
async function checksAnimation({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'animation-style');
  await page.getByRole('button', { name: 'slide-fade-in' }).click();
  await expect(page.getByText('Animation', { exact: true })).toHaveCSS(
    'animation-name',
    /slide-from-top/,
  );
}

/** Verify token labels, groups, and status palette specimens. */
async function checksTokens({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'focus-ring');
  for (const placement of ['inside', 'outside', 'mixed']) {
    await expect(page.getByText(placement, { exact: true })).toBeVisible();
  }
  await openStory(page, 'layer-style');
  await expect(page.getByText('fill.muted', { exact: true })).toBeVisible();
  await expect(page.getByText('outline.solid', { exact: true })).toBeVisible();
  await expect(page.getByText('indicator.end', { exact: true })).toBeVisible();

  await openStory(page, 'text-styles');
  await expect(page.getByText('Lever UI', { exact: true })).toHaveCount(11);
  await expect(page.getByText('textStyle: 7xl', { exact: true })).toBeVisible();

  await openStory(page, 'status-tokens');
  for (const prefix of ['bg', 'fg', 'border']) {
    await expect(page.getByText(`${prefix}.error`, { exact: true })).toBeVisible();
    await expect(page.getByText(`${prefix}.info`, { exact: true })).toBeVisible();
  }
}

/** Check six token docs render their distinct specimen collections. */
async function checksTokenDocs({ page }: { page: Page }): Promise<void> {
  for (const [id, heading] of [
    ['aspect-ratio', 'theme.tokens.aspectRatios'],
    ['radius', 'theme.tokens.radii'],
    ['breakpoints', 'theme.breakpoints'],
    ['easings', 'theme.tokens.easings'],
    ['shadows', 'theme.semanticTokens.shadows'],
    ['z-index', 'theme.tokens.zIndex'],
  ] as const) {
    await openStory(page, id);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await expect(page.locator('#storybook-root').getByText('undefined')).toHaveCount(0);
  }
  await openStory(page, 'breakpoints');
  await expect(page.getByText('sm', { exact: true })).toBeVisible();
  await openStory(page, 'shadows');
  await expect(page.getByText('inset', { exact: true })).toBeVisible();
}

/** Verify the remaining token tables expose populated theme values. */
async function checksExtendedTokenDocs({ page }: { page: Page }): Promise<void> {
  for (const [id, heading, sample] of [
    ['colors', 'gray', 'gray.500'],
    ['semantic-colors', 'background', 'bg'],
    ['durations', 'theme.tokens.durations', 'slowest'],
    ['keyframes', 'theme.keyframes', 'spin'],
    ['sizes', 'tokenSizes', 'Name'],
    ['spacing', 'theme.tokens.spacing', 'Pixel'],
    ['font', 'theme.tokens.fonts', 'Ag'],
    ['font-sizes', 'theme.tokens.fontSizes', 'Ag'],
    ['font-weights', 'theme.tokens.fontWeights', 'Ag'],
    ['letter-spacings', 'theme.tokens.letterSpacings', 'Wren Ashford'],
    ['line-heights', 'theme.tokens.lineHeights', 'The Lanternwright Chronicles is a fantasy'],
  ] as const) {
    await openStory(page, id);
    await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible();
    await expect(
      page
        .locator('#storybook-root')
        .getByText(sample, { exact: false })
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
  }
}

test('Tokens animation controls change the specimen', checksAnimation);
test('Tokens specimens cover groups and names', checksTokens);
test(
  'Tokens docs render ratio, radius, breakpoint, easing, shadow, and z-index collections',
  checksTokenDocs,
);
test(
  'Tokens color, motion, size, and typography docs render populated values',
  checksExtendedTokenDocs,
);
