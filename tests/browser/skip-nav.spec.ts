import { expect, test, type Locator, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Wait for Storybook to mount a Skip Nav story before checking its behavior. */
async function openStory(page: Page, story: string, testId: string): Promise<Locator> {
  await page.goto(`/iframe.html?id=components-skip-nav--${story}`);
  const element = page.getByTestId(testId);
  await expect(element).toBeAttached({ timeout: 15_000 });
  return element;
}

/** Follow the default skip link by keyboard and verify focus reaches content. */
async function verifiesDefaultSkipLink({ page }: { page: Page }): Promise<void> {
  const link = await openStory(page, 'basic', 'skip-nav-link');
  const content = page.getByTestId('skip-nav-content');
  await expect(link).toHaveAttribute('href', '#leverui-skip-nav');
  await expect(content).toHaveAttribute('id', 'leverui-skip-nav');
  await expect(content).toHaveAttribute('tabindex', '-1');
  await expect(link).toHaveAttribute('data-received-link-ref', 'true');
  await expect(content).toHaveAttribute('data-received-content-ref', 'true');
  await expect(link).toHaveCSS('position', 'absolute');
  await expect(link).toHaveCSS('clip', 'rect(0px, 0px, 0px, 0px)');
  await expect(link).toHaveCSS('overflow', 'hidden');

  await pressBrowserTab(page);
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('position', 'fixed');
  await expect(link).toHaveCSS('clip', 'auto');
  await expect(link).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(content).toBeFocused();
  await expect(page).toHaveURL(/#leverui-skip-nav$/);
}

test('default Skip Nav bypasses repeated navigation by keyboard', verifiesDefaultSkipLink);

/** Keep a changed target ID paired without replacing either native element. */
async function verifiesCustomTarget({ page }: { page: Page }): Promise<void> {
  const link = await openStory(page, 'custom-id', 'skip-nav-custom-link');
  const content = page.getByTestId('skip-nav-custom-content');
  await expect(link).toHaveAttribute('href', '#main-content');
  await expect(link).not.toHaveAttribute('id');
  await expect(content).toHaveAttribute('id', 'main-content');
  for (const element of [link, content]) {
    await element.evaluate(
      /** Mark both native nodes before the target ID changes. */
      (node) => node.setAttribute('data-original-node', 'true'),
    );
  }
  await page.getByTestId('skip-nav-change-target').click();
  await expect(link).toHaveAttribute('href', '#updated-main-content');
  await expect(content).toHaveAttribute('id', 'updated-main-content');
  await expect(link).toHaveAttribute('data-original-node', 'true');
  await expect(content).toHaveAttribute('data-original-node', 'true');
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(content).toBeFocused();
}

test('custom Skip Nav target follows reactive IDs', verifiesCustomTarget);

/** Preserve target and focus semantics through a caller-owned anchor. */
async function verifiesChildAnchor({ page }: { page: Page }): Promise<void> {
  const link = await openStory(page, 'child', 'skip-nav-child-link');
  const content = page.getByTestId('skip-nav-main-content');
  await expect(link).toHaveAttribute('href', '#leverui-skip-nav');
  await expect(link).toHaveClass(/leverui-skip-nav/);
  await expect(content).toHaveJSProperty('tagName', 'MAIN');
  await expect(content).toHaveAttribute('tabindex', '-1');
  await expect(content).toHaveAttribute('data-received-content-ref', 'true');
  await expect(content).toHaveClass(/leverui-skip-nav-content/);
  await expect(content).toHaveText('Caller-owned main element');
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(content).toBeFocused();
}

test('Skip Nav supports caller-owned links and destinations', verifiesChildAnchor);

/** Let consumer CSS change a public token without rebuilding the recipe. */
async function verifiesCssOverride({ page }: { page: Page }): Promise<void> {
  const link = await openStory(page, 'css-override', 'skip-nav-css-link');
  await link.focus();
  await expect(link).toHaveCSS('background-color', 'rgb(18, 67, 102)');
}

test('Skip Nav uses consumer CSS token overrides', verifiesCssOverride);
