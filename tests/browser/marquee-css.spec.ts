import { expect, test, type Page } from '@playwright/test';

interface ResolvedMarqueeCss {
  duration: string;
  delay: string;
  loopCount: string;
  edgeColor: string;
  edgeSize: string;
  animationDuration: string;
  animationDelay: string;
  animationIterationCount: string;
  gradient: string;
}

/** Read public variables and their effect on animated content and fades. */
async function readMarqueeCss(page: Page, prefix: string): Promise<ResolvedMarqueeCss> {
  return page.getByTestId(`${prefix}-root`).evaluate(
    /** Resolve the CSS cascade on one mounted Marquee specimen. */
    (root, specimen) => {
      const content = document.querySelector(`[data-testid="${specimen}-content"]`);
      const edge = document.querySelector(`[data-testid="${specimen}-edge"]`);
      if (!content || !edge) throw new Error('Marquee CSS specimen is incomplete.');
      const rootCss = getComputedStyle(root);
      const contentCss = getComputedStyle(content);
      return {
        duration: rootCss.getPropertyValue('--lui-marquee-duration').trim(),
        delay: rootCss.getPropertyValue('--lui-marquee-delay').trim(),
        loopCount: rootCss.getPropertyValue('--lui-marquee-loop-count').trim(),
        edgeColor: rootCss.getPropertyValue('--lui-marquee-edge-color').trim(),
        edgeSize: rootCss.getPropertyValue('--lui-marquee-edge-size').trim(),
        animationDuration: contentCss.animationDuration,
        animationDelay: contentCss.animationDelay,
        animationIterationCount: contentCss.animationIterationCount,
        gradient: getComputedStyle(edge).backgroundImage,
      };
    },
    prefix,
  );
}

/** Verify documented variables work through native style and stylesheets. */
async function verifiesCssOverrides({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-css--overrides');
  await expect(page.getByTestId('marquee-css-root')).toBeVisible({ timeout: 30_000 });
  const nativeStyle = await readMarqueeCss(page, 'marquee-css');
  expect(nativeStyle).toMatchObject({
    duration: '30s',
    delay: '5s',
    loopCount: '4',
    edgeColor: 'rgb(255, 0, 0)',
    edgeSize: '35%',
    animationDuration: '30s',
    animationDelay: '5s',
    animationIterationCount: '4',
  });
  expect(nativeStyle.gradient).toContain('rgb(255, 0, 0)');
  const stylesheet = await readMarqueeCss(page, 'marquee-stylesheet');
  expect(stylesheet).toMatchObject({
    duration: '27s',
    delay: '3s',
    loopCount: '5',
    edgeColor: 'rgb(0, 128, 0)',
    edgeSize: '25%',
    animationDuration: '27s',
    animationDelay: '3s',
    animationIterationCount: '5',
  });
  expect(stylesheet.gradient).toContain('rgb(0, 128, 0)');
}

test('Marquee accepts native style and consumer stylesheet motion overrides', verifiesCssOverrides);

/** Verify every public part accepts a stylesheet class and one part can be unstyled. */
async function verifiesPartHooks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-css--part-hooks');
  const root = page.getByTestId('marquee-parts-root');
  await expect(root).toBeVisible();
  await expect(root).toHaveCSS('width', '320px');
  await expect(page.getByTestId('marquee-parts-viewport')).toHaveCSS('height', '80px');
  await expect(page.getByTestId('marquee-parts-content').first()).toHaveCSS(
    'animation-duration',
    '11s',
  );
  await expect(page.getByTestId('marquee-parts-item').first()).toHaveCSS(
    'padding-inline-start',
    '13px',
  );
  const edge = page.getByTestId('marquee-parts-edge');
  await expect(edge).toHaveCSS('background-image', /rgb\(0, 0, 255\)/);
  await expect(page.getByTestId('marquee-parts-unstyled-edge')).toHaveCSS(
    'background-image',
    'none',
  );
}

/** Verify root unstyled suppresses default CSS without disabling the machine. */
async function verifiesUnstyledBehavior({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-css--unstyled');
  const root = page.getByTestId('marquee-unstyled-root');
  const content = page.getByTestId('marquee-unstyled-content').first();
  await expect(root).toHaveAttribute('role', 'region');
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).toHaveCSS('animation-name', 'none');
  await expect(page.getByTestId('marquee-unstyled-edge')).toHaveCSS('background-image', 'none');
  await root.hover();
  await expect(root).toHaveAttribute('data-paused', '');
}

test('Marquee public part classes override authored CSS', verifiesPartHooks);
test('Marquee unstyled keeps the primitive interaction', verifiesUnstyledBehavior);

/** Verify the primitive composition retains machine attributes and both edge refs. */
async function verifiesNativeComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-css--composition');
  const edge = page.getByTestId('marquee-composed-edge');
  await expect(edge).toBeVisible();
  await expect(edge).toHaveJSProperty('tagName', 'SPAN');
  await expect(edge).toHaveAttribute('data-side', 'start');
  await expect(edge).toHaveClass(/leverui-marquee__edge/);
  await expect(edge).toHaveCSS('background-image', /linear-gradient/);
  await expect(page.getByTestId('marquee-composed-refs')).toHaveText('matched');
  const viewport = page.getByTestId('marquee-composed-viewport');
  await expect(viewport).toHaveJSProperty('tagName', 'SECTION');
  await expect(viewport).toHaveClass(/leverui-marquee__viewport/);
}

test('Marquee parts preserve native composition and refs', verifiesNativeComposition);
