import { expect, test, type Page } from '@playwright/test';

/** Verify match options, native marks, CSS styling, and reactive text updates. */
async function verifiesHighlightContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-highlight--contract');
  const basic = page.getByTestId('highlight-basic');
  await expect(basic).toBeVisible({ timeout: 15_000 });
  await expect(basic).toHaveText('With Highlight, you can spotlight words.');
  const basicMark = basic.locator('mark');
  await expect(basicMark).toHaveText('spotlight');
  await expect(basicMark).toHaveClass(/leverui-mark/);
  await expect(basicMark).toHaveCSS('white-space', 'nowrap');
  await expect(basicMark).toHaveCSS('padding-left', '2px');
  await expect(basicMark).not.toHaveAttribute('styles');

  await expect(page.getByTestId('highlight-multiple').locator('mark')).toHaveText([
    'Solid',
    'Solid',
    'fast',
  ]);
  await expect(page.getByTestId('highlight-first').locator('mark')).toHaveText(['Solid']);
  await expect(page.getByTestId('highlight-case').locator('mark')).toHaveText('Solid');
  await expect(page.getByTestId('highlight-unmatched').locator('mark')).toHaveCount(0);
  await expect(page.getByTestId('highlight-unmatched')).toHaveText('Nothing matches here');

  const providerMarks = page.getByTestId('highlight-provider').locator('mark');
  await expect(providerMarks).toHaveText(['Solid', 'fast']);
  await expect(providerMarks.first()).toHaveClass(/provider-mark/);
  await expect(providerMarks.first()).toHaveAttribute('title', 'Provided match');
  await expect(providerMarks.first()).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(providerMarks.first()).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(providerMarks.first()).not.toHaveAttribute('variant');
  await expect(page.getByTestId('highlight-unstyled-provider').locator('mark')).toHaveCSS(
    'white-space',
    'normal',
  );

  const live = page.getByTestId('highlight-live');
  await expect(live.locator('mark')).toHaveText('great');
  await expect(live.locator('mark')).toHaveCSS('font-weight', '400');
  await page.addStyleTag({ content: '.leverui-mark{background-color:rgb(1, 2, 3)}' });
  await expect(basicMark).toHaveCSS('background-color', 'rgb(1, 2, 3)');
  await providerMarks.first().evaluate(
    /** Mark the provider-styled node before its variant changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('highlight-toggle').click();
  await expect(live).toHaveText('Solid is fast now');
  await expect(live.locator('mark')).toHaveText('fast');
  await expect(live.locator('mark')).toHaveCSS('font-weight', '700');
  await expect(providerMarks.first()).toHaveAttribute('data-original-node', 'true');
  await expect(providerMarks.first()).toHaveCSS('font-weight', '500');
  await expect(providerMarks.first()).toHaveCSS('color', 'rgb(239, 68, 68)');
}

/** Verify public hook support for whole-word matching and live query changes. */
async function verifiesHighlightHook({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-highlight--hook');
  const output = page.getByTestId('highlight-hook-chunks');
  await expect(output).toHaveText('[Team] teammate [team]', { timeout: 15_000 });
  await page.getByTestId('highlight-hook-toggle').click();
  await expect(output).toHaveText('Team teammate team');
}

/** Verify that hook chunks support the documented decorative composition. */
async function verifiesHighlightSquiggle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-highlight--squiggle');
  const heading = page.getByTestId('highlight-squiggle');
  await expect(heading).toBeVisible({ timeout: 15_000 });
  await expect(heading).toHaveText('Accessible by default, delightful by design.');
  await expect(page.getByTestId('highlight-squiggle-mark')).toHaveText([
    'Accessible',
    'delightful by design.',
  ]);
  await expect(page.getByTestId('highlight-squiggle-mark').first()).toHaveCSS(
    'text-decoration-style',
    'wavy',
  );
}

test('Highlight matches and styles text reactively', verifiesHighlightContract);
test('useHighlight exposes reactive whole-word matching', verifiesHighlightHook);
test('useHighlight supports decorative mark composition', verifiesHighlightSquiggle);
