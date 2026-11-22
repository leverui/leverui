import { expect, test, type Page } from '@playwright/test';

type TriggerMetrics = { fontSize: number; paddingLeft: number };

/** Read responsive CSS from the rendered disclosure trigger. */
async function readMetrics(page: Page): Promise<TriggerMetrics> {
  return page.getByTestId('responsive-accordion-trigger').evaluate(
    /** Compare resolved CSS values rather than generated class names. */
    (element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        paddingLeft: Number.parseFloat(style.paddingLeft),
      };
    },
  );
}

/** Change viewport width without replacing the same Accordion machine. */
async function verifiesResponsiveDisclosure({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-accordion-responsive--breakpoint');
  const trigger = page.getByTestId('responsive-accordion-trigger');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false', { timeout: 30_000 });
  const narrow = await readMetrics(page);
  await page.setViewportSize({ width: 900, height: 800 });
  const wide = await readMetrics(page);
  expect(wide.fontSize).toBeGreaterThan(narrow.fontSize);
  expect(wide.paddingLeft).toBeGreaterThan(narrow.paddingLeft);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Responsive content')).toBeVisible();
}

test(
  'Accordion responds across a breakpoint without losing disclosure',
  verifiesResponsiveDisclosure,
);
