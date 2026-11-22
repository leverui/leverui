import { expect, test, type Page } from '@playwright/test';

/** Keep custom icons, Avatar, Badge, and subtext inside accessible triggers. */
async function verifiesGuideCompositions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-guide--compositions');
  const icon = page.getByTestId('accordion-icon-trigger');
  const avatar = page.getByTestId('accordion-avatar-trigger');
  const subtext = page.getByTestId('accordion-subtext-trigger');
  await expect(icon.locator('svg')).toBeVisible({ timeout: 30_000 });
  await expect(avatar).toHaveAttribute('aria-expanded', 'true');
  await expect(avatar.getByText('Ada Lovelace')).toBeVisible();
  await expect(avatar.getByText('Top Rated')).toBeVisible();
  await expect(subtext).toContainText('Click to expand');
  await subtext.click();
  await expect(subtext).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Ships in two days.')).toBeVisible();
}

test('Accordion composes icon, avatar, badge, and subtext guides', verifiesGuideCompositions);

/** Verify context values and sibling actions do not steal disclosure clicks. */
async function verifiesContextAndActions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-context--contract');
  const styled = page.getByTestId('accordion-styled-trigger');
  const action = page.getByTestId('accordion-action-trigger');
  await expect(page.getByTestId('accordion-root-state')).toHaveText('styled', { timeout: 30_000 });
  await expect(page.getByTestId('accordion-item-state')).toHaveText('Expanded');
  const openBackground = await styled.evaluate(
    /** Read the expanded-state style prop from the rendered trigger. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByRole('button', { name: 'Action', exact: true }).click();
  await expect(page.getByTestId('accordion-action-count')).toHaveText('1');
  await expect(action).toHaveAttribute('aria-expanded', 'false');
  await styled.click();
  await expect(page.getByTestId('accordion-root-state')).toHaveText('');
  await expect(page.getByTestId('accordion-item-state')).toHaveText('Collapsed');
  const closedBackground = await styled.evaluate(
    /** Read the trigger after its expanded-state style stops matching. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(openBackground).not.toBe(closedBackground);
  await action.click();
  await expect(page.getByTestId('accordion-root-state')).toHaveText('actions');
}

test('Accordion contexts and sibling actions preserve disclosure state', verifiesContextAndActions);
