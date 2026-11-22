import { expect, test, type Page } from '@playwright/test';

/** Keep sidebar selection, grid state, and responsive placement in sync. */
async function verifiesPresetSidebar({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-datepicker-presets-guide--sidebar');
  const sidebar = page.getByTestId('date-picker-preset-sidebar');
  const grid = page.getByTestId('date-picker-sidebar-days');
  await expect(sidebar).toBeVisible({ timeout: 30_000 });
  await expect(grid).toBeVisible();
  const preset = sidebar.getByRole('button', { name: 'Select Next week' });
  await preset.click();
  await expect(preset).toHaveAttribute('data-selected', '');
  await expect(page.getByTestId('date-picker-sidebar-value')).toHaveText('2026-03-21');
  await expect(grid.locator('td[data-value="2026-03-21"]')).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const wideSidebar = await sidebar.boundingBox();
  const wideGrid = await grid.boundingBox();
  expect(wideSidebar).not.toBeNull();
  expect(wideGrid).not.toBeNull();
  if (!wideSidebar || !wideGrid) return;
  expect(wideSidebar.x + wideSidebar.width).toBeLessThanOrEqual(wideGrid.x + 2);

  await page.setViewportSize({ width: 375, height: 850 });
  const narrowSidebar = await sidebar.boundingBox();
  const narrowGrid = await grid.boundingBox();
  expect(narrowSidebar).not.toBeNull();
  expect(narrowGrid).not.toBeNull();
  if (!narrowSidebar || !narrowGrid) return;
  expect(narrowSidebar.y + narrowSidebar.height).toBeLessThanOrEqual(narrowGrid.y + 2);
}

test('DatePicker sidebar presets synchronize with the grid and layout', verifiesPresetSidebar);
