import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const css = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render authored Drawer hooks without a component runtime or style cache. */
async function loadDrawerCss(page: Page): Promise<void> {
  await page.setContent(`
    <style>${css}</style>
    <div id="positioner" class="leverui-drawer__positioner" data-leverui-drawer-css
      data-placement="end">
      <div id="content" class="leverui-drawer__content" data-leverui-drawer-css
        data-size="xs" data-placement="end" data-state="open">
        <header id="header" class="leverui-drawer__header" data-leverui-drawer-css>Title</header>
        <div id="body" class="leverui-drawer__body" data-leverui-drawer-css>Body</div>
        <footer id="footer" class="leverui-drawer__footer" data-leverui-drawer-css>Footer</footer>
      </div>
    </div>
  `);
}

/** Check the stylesheet's geometry, motion, and logical RTL direction. */
async function verifiesDrawerStyles({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 900, height: 700 });
  await loadDrawerCss(page);
  const positioner = page.locator('#positioner');
  const content = page.locator('#content');
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');
  await expect(content).toHaveCSS('max-width', '320px');
  await expect(content).toHaveCSS('animation-name', 'slide-from-right-full, fade-in');
  await content.evaluate(
    /** Suppress entrance motion while the initial-open lifecycle marker is present. */
    (element) => element.setAttribute('data-leverui-private-skip-initial-animation', ''),
  );
  await expect(content).toHaveCSS('animation-name', 'none');
  await content.evaluate(
    /** Resume normal motion after the initial-open lifecycle ends. */
    (element) => element.removeAttribute('data-leverui-private-skip-initial-animation'),
  );
  await expect(page.locator('#header')).toHaveCSS('padding-top', '24px');
  await expect(page.locator('#body')).toHaveCSS('overflow', 'auto');
  await expect(page.locator('#footer')).toHaveCSS('padding-bottom', '16px');

  await page.evaluate(
    /** Exercise the finite size and contained attributes on the same nodes. */
    () => {
      document.getElementById('positioner')?.setAttribute('data-contained', 'true');
      const panel = document.getElementById('content');
      panel?.setAttribute('data-contained', 'true');
      panel?.setAttribute('data-size', 'full');
    },
  );
  await expect(positioner).toHaveCSS('padding', '16px');
  await expect(content).toHaveCSS('max-width', '900px');
  await expect(content).toHaveCSS('height', '700px');

  await page.evaluate(
    /** Confirm the start edge mirrors its entrance motion under RTL. */
    () => {
      document.documentElement.dir = 'rtl';
      document.getElementById('content')?.setAttribute('data-placement', 'start');
    },
  );
  await expect(content).toHaveCSS('animation-name', 'slide-from-right-full, fade-in');
}

test('authored Drawer CSS works without runtime styles', verifiesDrawerStyles);

/** Check responsive Drawer choices and RTL motion without JavaScript styling. */
async function verifiesResponsiveDrawerCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 700, height: 700 });
  await loadDrawerCss(page);
  const content = page.locator('#content');
  const positioner = page.locator('#positioner');
  await content.evaluate(
    /** Reflect the documented medium-range choices on both portal parts. */
    (element) => {
      element.setAttribute('data-size-md-down', 'full');
      element.setAttribute('data-size-md', 'lg');
      element.setAttribute('data-placement-md-down', 'bottom');
      element.setAttribute('data-placement-md', 'end');
    },
  );
  await positioner.evaluate(
    /** Keep the positioner aligned to the same responsive edge. */
    (element) => {
      element.setAttribute('data-placement-md-down', 'bottom');
      element.setAttribute('data-placement-md', 'end');
    },
  );
  await expect(content).toHaveCSS('max-width', '100%');
  await expect(content).toHaveCSS('height', '700px');
  await expect(content).toHaveCSS('animation-name', 'slide-from-bottom-full, fade-in');
  await expect(positioner).toHaveCSS('align-items', 'flex-end');

  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveCSS('animation-name', 'slide-from-right-full, fade-in');
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');

  await content.evaluate(
    /** Exercise another finite size and the logical start edge. */
    (element) => {
      element.setAttribute('data-size-md', 'sm');
      element.setAttribute('data-placement-md', 'start');
    },
  );
  await positioner.evaluate(
    /** Keep start alignment on the same breakpoint. */
    (element) => element.setAttribute('data-placement-md', 'start'),
  );
  await expect(content).toHaveCSS('max-width', '448px');
  await expect(content).toHaveCSS('animation-name', 'slide-from-left-full, fade-in');
  await expect(positioner).toHaveCSS('justify-content', 'flex-start');
  await page.evaluate(
    /** Mirror logical start motion while keeping the same attributes. */
    () => {
      document.documentElement.dir = 'rtl';
    },
  );
  await expect(content).toHaveCSS('animation-name', 'slide-from-right-full, fade-in');
}

test('responsive Drawer CSS preserves edge motion and geometry', verifiesResponsiveDrawerCss);

const responsiveCases = [
  ['sm', 500, 'sm', 'start', '448px', 'slide-from-left-full, fade-in'],
  ['md', 800, 'md', 'top', '100%', 'slide-from-top-full, fade-in'],
  ['lg', 1100, 'lg', 'end', '672px', 'slide-from-right-full, fade-in'],
  ['xl', 1300, 'xl', 'bottom', '100%', 'slide-from-bottom-full, fade-in'],
  ['2xl', 1600, 'full', 'end', '1600px', 'slide-from-right-full, fade-in'],
  ['2xl-down', 1400, 'md', 'start', '512px', 'slide-from-left-full, fade-in'],
  ['xl-down', 1100, 'lg', 'end', '672px', 'slide-from-right-full, fade-in'],
  ['lg-down', 900, 'xl', 'start', '896px', 'slide-from-left-full, fade-in'],
  ['md-down', 700, 'full', 'bottom', '100%', 'slide-from-bottom-full, fade-in'],
  ['sm-down', 400, 'xs', 'end', '320px', 'slide-from-right-full, fade-in'],
] as const;

/** Verify every supported responsive selector at a width inside its range. */
async function verifiesDrawerBreakpointSelectors({ page }: { page: Page }): Promise<void> {
  await loadDrawerCss(page);
  const content = page.locator('#content');
  const positioner = page.locator('#positioner');
  for (const [suffix, width, size, placement, maxWidth, animation] of responsiveCases) {
    await page.setViewportSize({ width, height: 700 });
    await page.evaluate(
      /** Replace the previous responsive attributes without touching the base. */
      ({ suffix, size, placement }) => {
        const panel = document.getElementById('content');
        const aligner = document.getElementById('positioner');
        if (!panel || !aligner) throw new Error('Drawer CSS fixture is incomplete.');
        for (const element of [panel, aligner]) {
          for (const name of element.getAttributeNames()) {
            if (name.startsWith('data-size-') || name.startsWith('data-placement-')) {
              element.removeAttribute(name);
            }
          }
          element.setAttribute(`data-placement-${suffix}`, placement);
        }
        panel.setAttribute(`data-size-${suffix}`, size);
      },
      { suffix, size, placement },
    );
    await expect(content).toHaveCSS('max-width', maxWidth);
    await expect(content).toHaveCSS('animation-name', animation);
    const alignment =
      placement === 'top' || placement === 'bottom' ? 'align-items' : 'justify-content';
    const expectedAlignment =
      placement === 'start' || placement === 'top' ? 'flex-start' : 'flex-end';
    await expect(positioner).toHaveCSS(alignment, expectedAlignment);
  }
}

test(
  'all Drawer responsive CSS selectors resolve their finite choices',
  verifiesDrawerBreakpointSelectors,
);
