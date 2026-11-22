import { expect, test, type Page } from '@playwright/test';
import { appearance, defaultCss, specimen } from './checkmark-css-support';

/** Verify filled backgrounds for selected and responsive Checkmark variants. */
async function verifiesFilledActiveState({ page }: { page: Page }): Promise<void> {
  const markup = [
    specimen({ id: 'unchecked-filled', checked: false, filled: true, variant: 'solid' }),
    specimen({ id: 'unchecked-empty', checked: false, filled: false, variant: 'solid' }),
    specimen({ id: 'checked-filled', checked: true, filled: true, variant: 'solid' }),
    specimen({ id: 'checked-empty', checked: true, filled: false, variant: 'solid' }),
    specimen({ id: 'mixed-filled', indeterminate: true, filled: true, variant: 'solid' }),
    specimen({ id: 'mixed-empty', indeterminate: true, filled: false, variant: 'solid' }),
    specimen({ id: 'outline-filled', checked: true, filled: true, variant: 'outline' }),
    specimen({ id: 'outline-empty', checked: true, filled: false, variant: 'outline' }),
    specimen({ id: 'subtle-filled', checked: true, filled: true, variant: 'subtle' }),
    specimen({
      id: 'subtle-responsive',
      checked: true,
      filled: true,
      variant: { base: 'solid', md: 'subtle' },
    }),
    specimen({
      id: 'responsive-filled',
      checked: true,
      filled: { base: true, md: false, lg: true },
      variant: 'solid',
    }),
  ].join('');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  expect((await appearance(page, 'unchecked-filled')).backgroundColor).not.toBe(
    (await appearance(page, 'unchecked-empty')).backgroundColor,
  );
  expect((await appearance(page, 'checked-filled')).backgroundColor).toBe(
    (await appearance(page, 'checked-empty')).backgroundColor,
  );
  expect((await appearance(page, 'mixed-filled')).backgroundColor).toBe(
    (await appearance(page, 'mixed-empty')).backgroundColor,
  );
  expect((await appearance(page, 'outline-filled')).backgroundColor).toBe(
    (await appearance(page, 'unchecked-filled')).backgroundColor,
  );
  expect((await appearance(page, 'outline-filled')).backgroundColor).not.toBe(
    (await appearance(page, 'outline-empty')).backgroundColor,
  );
  expect((await appearance(page, 'subtle-filled')).backgroundColor).toBe(
    (await appearance(page, 'unchecked-filled')).backgroundColor,
  );
  await page.setViewportSize({ width: 400, height: 600 });
  expect((await appearance(page, 'subtle-responsive')).backgroundColor).toBe(
    (await appearance(page, 'checked-empty')).backgroundColor,
  );
  for (const width of [400, 900, 1100]) {
    await page.setViewportSize({ width, height: 600 });
    expect((await appearance(page, 'responsive-filled')).backgroundColor).toBe(
      (await appearance(page, 'checked-empty')).backgroundColor,
    );
  }
  expect((await appearance(page, 'subtle-responsive')).backgroundColor).toBe(
    (await appearance(page, 'subtle-filled')).backgroundColor,
  );
}

test(
  'filled Checkmarks follow active and responsive variant backgrounds',
  verifiesFilledActiveState,
);
