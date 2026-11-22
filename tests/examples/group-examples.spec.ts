import { expect, test, type Page } from '@playwright/test';

/** Open one maintained Group example in the Storybook preview. */
async function openGroupStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=layout-group-examples--${id}`);
  await expect(page.locator('#storybook-root .leverui-group').first()).toBeVisible();
}

/** Check the patterned row and ordinary button grouping. */
async function verifiesBasicGroupExamples({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openGroupStory(page, 'basic');
  const boxes = page.locator('#storybook-root .group-example-pattern');
  await expect(boxes).toHaveCount(2);
  await expect(boxes.first()).toHaveCSS('width', '160px');
  await expect(boxes.first()).toHaveCSS('height', '80px');
  await expect(page.locator('#storybook-root .leverui-group')).toHaveCSS('gap', '8px');

  await openGroupStory(page, 'with-button');
  await expect(page.locator('#storybook-root .leverui-group button')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Item 1' })).toBeVisible();
}

/** Check attached children and equal-width growth. */
async function verifiesAttachedAndGrowExamples({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openGroupStory(page, 'attached');
  const groups = page.locator('#storybook-root .leverui-group');
  await expect(groups).toHaveCount(2);
  await expect(groups.first()).toHaveCSS('gap', '0px');
  await expect(groups.last()).toHaveCSS('gap', '0px');
  await expect(page.getByText('Test coverage')).toBeVisible();

  await openGroupStory(page, 'grow');
  const buttons = page.locator('#storybook-root .leverui-group button');
  await expect(buttons).toHaveCount(3);
  await expect(buttons.first()).toHaveCSS('flex-grow', '1');
  const widths = await buttons.evaluateAll(
    /** Measure the three rendered controls in the same row. */
    (elements) => elements.map((element) => element.getBoundingClientRect().width),
  );
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
}

test('Group Basic and Button match the layouts', verifiesBasicGroupExamples);
test('Group Attached and Grow match the behavior', verifiesAttachedAndGrowExamples);
