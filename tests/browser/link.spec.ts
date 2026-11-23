import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Allow the large Storybook source graph to finish loading before Link assertions. */
async function openLinkContract(page: Page): Promise<void> {
  test.setTimeout(120_000);
  await page.goto('/iframe.html?id=content-link--contract');
  await page.getByTestId('link-plain').waitFor({ state: 'attached', timeout: 90_000 });
}

/** Verify anchor semantics, recipe variants, responsive values, and active state. */
async function verifiesLinkRecipe({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await openLinkContract(page);
  const plain = page.getByTestId('link-plain');
  const underline = page.getByTestId('link-underline');
  await expect(plain).toHaveJSProperty('tagName', 'A');
  await expect(plain).toHaveAttribute('href', '#plain');
  await expect(plain).toHaveClass(/lui-link/);
  await expect(plain).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(plain).toHaveCSS('display', 'inline-flex');
  await expect(plain).toHaveCSS('text-decoration-line', 'none');
  await expect(underline).toHaveCSS('text-decoration-line', 'underline');
  await expect(underline).not.toHaveAttribute('variant');
  await expect(page.getByTestId('link-responsive')).toHaveCSS('text-decoration-line', 'none');
  await expect(page.getByTestId('link-responsive-plain')).toHaveCSS(
    'text-decoration-line',
    'underline',
  );
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByTestId('link-responsive')).toHaveCSS('text-decoration-line', 'underline');
  await expect(page.getByTestId('link-responsive-plain')).toHaveCSS('text-decoration-line', 'none');
  await expect(page.getByTestId('link-current')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('link-external')).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByTestId('link-router')).toHaveAttribute('href', '#route');
  await expect(page.getByTestId('link-router')).toHaveClass(/lui-link/);
}

/** Verify reactivity, local styles, and the stretched overlay's click behavior. */
async function verifiesLinkComposition({ page }: { page: Page }): Promise<void> {
  await openLinkContract(page);
  const inherited = page.getByTestId('link-inherited');
  await expect(inherited).toHaveAttribute('title', 'Shared link');
  await expect(inherited).toHaveCSS('text-decoration-line', 'none');
  await inherited.evaluate(
    /** Tag the original anchor before its provider value changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('link-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('text-decoration-line', 'underline');
  await expect(page.getByTestId('link-fixed')).toHaveAttribute('title', 'Local link');
  await expect(page.getByTestId('link-unstyled')).toHaveCSS('display', 'inline');
  await expect(page.getByTestId('link-css')).toHaveCSS('color', 'rgb(20, 30, 40)');

  const box = page.getByTestId('link-box');
  await expect(box).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(box).toHaveCSS('position', 'relative');
  await expect(box).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(page.getByTestId('link-overlay')).toHaveCSS('position', 'static');
  await expect(page.getByTestId('link-overlay')).not.toHaveAttribute(
    'data-lui-private-style-runtime',
  );
  await expect(page.getByTestId('link-inner')).toHaveCSS('position', 'relative');
  await expect(page.getByTestId('link-unstyled-box')).toHaveCSS('position', 'static');
  await expect(page.getByTestId('link-unstyled-overlay')).toHaveCSS('position', 'static');
  const unstyledOverlayContent = await page.getByTestId('link-unstyled-overlay').evaluate(
    /** Confirm the stretched hit area is absent when the overlay is unstyled. */
    (element) => getComputedStyle(element, '::before').content,
  );
  expect(unstyledOverlayContent).toBe('none');
  await box.click({ position: { x: 280, y: 130 } });
  await expect(page).toHaveURL(/#article$/);
  await page.getByTestId('link-inner').click();
  await expect(page).toHaveURL(/#author$/);
}

test('Link preserves native semantics and variants', verifiesLinkRecipe);
test('Link composes providers and stretched card navigation', verifiesLinkComposition);

/** Verify hover, keyboard focus, Enter navigation, and composed card hits. */
async function verifiesNavigationStates({ page }: { page: Page }): Promise<void> {
  await openLinkContract(page);
  const plain = page.getByTestId('link-plain');
  await expect(plain).toHaveCSS('text-decoration-line', 'none');
  await plain.hover();
  await expect(plain).toHaveCSS('text-decoration-line', 'underline');
  await expect(plain).toHaveCSS('text-underline-offset', '3px');
  await page.mouse.move(0, 0);
  await expect(plain).toHaveCSS('text-decoration-line', 'none');
  await pressBrowserTab(page);
  await expect(plain).toBeFocused();
  await expect(plain).toHaveCSS('outline-style', 'solid');
  await expect(plain).toHaveCSS('outline-width', '2px');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#plain$/);

  const composed = page.getByTestId('link-composed-box');
  await composed.click({ position: { x: 280, y: 130 } });
  await expect(page).toHaveURL(/#composed-article$/);
  await page.getByTestId('link-composed-inner').click();
  await expect(page).toHaveURL(/#composed-inner$/);
}

/** Verify palette roles, nearest theme scope, and unlayered consumer CSS. */
async function verifiesLinkCssScopes({ page }: { page: Page }): Promise<void> {
  await openLinkContract(page);
  const light = await page.getByTestId('link-light').evaluate(
    /** Read the light-scope palette foreground color. */
    (element) => getComputedStyle(element).color,
  );
  await expect(page.getByTestId('link-green')).not.toHaveCSS('color', light);
  await expect(page.getByTestId('link-blue')).toHaveCSS('color', light);
  await expect(page.getByTestId('link-dark')).not.toHaveCSS('color', light);
  await expect(page.getByTestId('link-nested-light')).toHaveCSS('color', light);

  await page.addStyleTag({
    content: '.lui-link[data-testid="link-plain"]{color:rgb(1, 2, 3);text-decoration:underline}',
  });
  await expect(page.getByTestId('link-plain')).toHaveCSS('color', 'rgb(1, 2, 3)');
  await expect(page.getByTestId('link-plain')).toHaveCSS('text-decoration-line', 'underline');
}

test(
  'Link preserves hover, focus, keyboard navigation, and composed overlays',
  verifiesNavigationStates,
);
test('Link follows palette scopes and consumer CSS', verifiesLinkCssScopes);
