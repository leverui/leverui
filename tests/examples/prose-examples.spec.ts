import { expect, test, type Page } from '@playwright/test';

const stories = {
  basic: 'Heading level 1',
  sizes: 'Heading level 1',
  sink: 'Blockquotes',
  blockquote: 'A short quote fits on one line.',
  list: 'Coffee',
  'solid-markdown': 'This text comes from a Markdown string.',
  table: 'Developer advocate',
} as const;

/** Verify every Prose story renders the corresponding content. */
async function verifiesProseStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const [story, expected] of Object.entries(stories)) {
    await page.goto(`/iframe.html?id=typography-prose--${story}`);
    await expect(page.locator('#storybook-root .lui-prose').first()).toContainText(expected, {
      timeout: 45_000,
    });
  }
}

/** Verify list markers and table structure survive the CSS reset. */
async function verifiesProseSemantics({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-prose--list');
  await expect(page.locator('.lui-prose ul > li').first()).toHaveCSS('list-style-type', 'disc');
  await expect(page.locator('.lui-prose ol > li').first()).toHaveCSS('list-style-type', 'decimal');
  await page.goto('/iframe.html?id=typography-prose--table');
  await expect(page.locator('.lui-prose thead th')).toHaveCount(3);
  await expect(page.locator('.lui-prose tbody tr')).toHaveCount(4);
}

/** Confirm an opted-out subtree does not receive paragraph spacing. */
async function verifiesProseOptOut({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-prose--basic');
  const paragraph = page.locator('.lui-prose > p').nth(1);
  await expect(paragraph).toHaveCSS('margin-top', '14px');
  await paragraph.evaluate(
    /** Add a paragraph beneath an opted-out descendant of the rendered Prose. */
    (element) => {
      const excluded = document.createElement('div');
      excluded.className = 'not-prose';
      excluded.innerHTML = '<p>Excluded paragraph</p>';
      element.parentElement?.append(excluded);
    },
  );
  await expect(page.locator('.not-prose p')).toHaveCSS('margin-top', '0px');
}

/** Confirm Markdown source becomes semantic elements inside the Prose scope. */
async function verifiesSolidMarkdown({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-prose--solid-markdown');
  const prose = page.locator('.lui-prose');
  await expect(prose.locator('h2')).toHaveText('Heading');
  await expect(prose.locator('ul > li')).toHaveCount(4);
  await expect(prose.locator('a')).toHaveCount(2);
  await expect(prose.locator('a').first()).toHaveAttribute('href', 'https://leverui.com');
}

/** Verify native CSS hooks, consumer variables, and the unstyled opt-out. */
async function verifiesProseCssContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-prose--basic');
  const prose = page.locator('.lui-prose');
  await expect(prose).toHaveCSS('max-width', /px$/);
  expect(await prose.getAttribute('class')).not.toMatch(/\bcss-/);
  await page.addStyleTag({
    content: '.lui-prose { --lui-prose-color: rgb(12, 34, 56); }',
  });
  await expect(prose).toHaveCSS('color', 'rgb(12, 34, 56)');
  await prose.evaluate(
    /** Exercise the attribute path used by the unstyled prop. */
    (element) => element.setAttribute('data-unstyled', ''),
  );
  await expect(prose).toHaveCSS('max-width', 'none');
  await expect(prose.locator('p').first()).toHaveCSS('margin-top', '0px');
}

test('all seven Prose examples render', verifiesProseStories);
test('Prose lists and tables retain native semantics', verifiesProseSemantics);
test('not-prose excludes descendant typography rules', verifiesProseOptOut);
test('Solid Markdown renders semantic Prose content', verifiesSolidMarkdown);
test('Prose CSS variables and unstyled hook add no runtime styles', verifiesProseCssContract);
