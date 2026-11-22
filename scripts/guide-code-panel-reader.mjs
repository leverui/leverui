import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const siteUrl = process.env.LEVERUI_SITE_URL ?? 'http://127.0.0.1:4173';
/** Guides whose page has code samples but no live previews. */
const guidesWithoutPreviews = new Set(['portal', 'use-payment-inputs']);

/** Read one story's displayed files, using the same text a visitor would copy. */
async function readStoryFiles(story) {
  await story
    .getByRole('group', { name: /example view$/ })
    .getByRole('button', { name: 'Code', exact: true })
    .click();
  await story.locator('.guide-story-code pre').first().waitFor();
  return story.locator('.guide-story-code .guide-code-block').evaluateAll(
    /** Pair each code block with its filename label. */
    (blocks) =>
      blocks.map(
        /** Read one block's filename label and copyable source text. */
        (block) => ({
          label: block.querySelector('.guide-code-toolbar > span')?.textContent ?? '',
          source: block.querySelector('pre')?.textContent ?? '',
        }),
      ),
  );
}

/**
 * Wait until the guide's galleries have rendered every example. The intro and examples
 * galleries resolve the same story module separately, so the count can still grow briefly
 * after the first example appears.
 */
async function waitForStories(page) {
  await page.waitForFunction(
    /** Pass once the example count holds steady across several consecutive checks. */
    ({ selector, checks }) => {
      const count = document.querySelectorAll(selector).length;
      const previous = window.leveruiStoryCount ?? { count: -1, steady: 0 };
      const steady = count > 0 && count === previous.count ? previous.steady + 1 : 0;
      window.leveruiStoryCount = { count, steady };
      return steady >= checks;
    },
    { selector: '.guide-story', checks: 5 },
    { polling: 100 },
  );
}

/** Collect every example's Code tab from the running documentation site. */
export async function readGuidePanels(slug) {
  if (guidesWithoutPreviews.has(slug)) return [];
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${siteUrl}/docs/components/${slug}`, { waitUntil: 'load' });
    const stories = page.locator('.guide-story');
    await stories
      .first()
      .getByRole('group', { name: /example view$/ })
      .getByRole('button', { name: 'Code', exact: true })
      .waitFor();
    await waitForStories(page);
    const panels = [];
    for (let index = 0; index < (await stories.count()); index += 1) {
      panels.push(await readStoryFiles(stories.nth(index)));
    }
    assert.ok(panels.length > 0, `${slug} has no Code tabs.`);
    return panels;
  } finally {
    await browser.close();
  }
}
