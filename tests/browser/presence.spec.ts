import { expect, test, type Page } from '@playwright/test';

/** Check CSS animations, child events, and mount strategies. */
async function verifiesPresenceContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-presence--contract');
  const fade = page.getByTestId('presence-fade');
  const scale = page.getByTestId('presence-scale');
  const slideFade = page.getByTestId('presence-slide-fade');
  const slide = page.getByTestId('presence-slide');
  const lazy = page.getByTestId('presence-lazy');
  const exit = page.getByTestId('presence-exit');
  const initial = page.getByTestId('presence-initial');

  await expect(initial).toBeVisible();
  await expect(initial).toHaveCSS('animation-name', 'none');
  await expect(fade).toHaveCount(1);
  await expect(fade).toBeHidden();
  await expect(fade).toHaveAttribute('data-presence-root');
  await expect(fade).toHaveClass(/lui-presence/);
  await expect(fade).toHaveAttribute('data-ref-tag', 'section');
  await expect(fade).toHaveAttribute('aria-label', 'Fade example');
  await expect(fade).toHaveCSS('padding-top', '16px');
  await expect(lazy).toHaveCount(0);
  await expect(exit).toHaveCount(1);
  await expect(exit).toBeHidden();
  await expect(page.getByTestId('presence-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('presence-lazy-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('presence-exit-toggle')).toHaveAttribute('aria-expanded', 'false');

  await page.getByTestId('presence-toggle').click();
  await expect(page.getByTestId('presence-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(fade).toBeVisible();
  await expect(fade).toHaveAttribute('data-state', 'open');
  await expect(fade).toHaveCSS('animation-name', 'fade-in');
  await page.addStyleTag({
    content: '.lui-presence.presence-contract-fade { padding: 20px; }',
  });
  await expect(fade).toHaveCSS('padding-top', '20px');
  await expect(scale).toHaveCSS('animation-name', 'scale-in, fade-in');
  await expect(slideFade).toHaveCSS('animation-name', 'slide-from-bottom, fade-in');
  await expect(slide).toHaveCSS('animation-name', 'slide-from-bottom-full');
  await page.getByTestId('presence-child').click();
  await expect(page.getByTestId('presence-child')).toHaveText('Clicks: 1');
  await page.getByTestId('presence-toggle').click();
  await expect(page.getByTestId('presence-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(fade).toHaveAttribute('data-state', 'closed');
  await expect(fade).toHaveCSS('animation-name', 'fade-out');
  await expect(fade).toBeHidden();
  await expect(fade).toHaveCount(1);

  await page.getByTestId('presence-lazy-toggle').click();
  await expect(page.getByTestId('presence-lazy-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(lazy).toBeVisible();
  await page.getByTestId('presence-lazy-toggle').click();
  await expect(page.getByTestId('presence-lazy-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(lazy).toBeHidden();
  await expect(lazy).toHaveCount(1);

  await page.getByTestId('presence-exit-toggle').click();
  await expect(page.getByTestId('presence-exit-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(exit).toBeVisible();
  await page.getByTestId('presence-exit-toggle').click();
  await expect(page.getByTestId('presence-exit-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(exit).toHaveCount(0);
  await expect(page.getByTestId('presence-exit-count')).toHaveText('1');
}

test('Presence preserves CSS animation and render strategies', verifiesPresenceContract);

/** Verify `asChild` forwards state and both refs to the native child. */
async function verifiesPresenceAsChild({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-presence--contract');
  const child = page.getByTestId('presence-child-element');
  await expect(child).toHaveCount(0);
  await expect(page.getByTestId('presence-child-toggle')).toHaveAttribute('aria-expanded', 'false');

  await page.getByTestId('presence-child-toggle').click();
  await expect(page.getByTestId('presence-child-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(child).toBeVisible();
  await expect(child).toHaveAttribute('data-presence-root');
  await expect(child).toHaveClass(/lui-presence/);
  await expect(child).toHaveAttribute('data-state', 'open');
  await expect(child).toHaveAttribute('data-parent-ref-tag', 'section');
  await expect(child).toHaveAttribute('data-child-ref-tag', 'section');
  await expect(child).toHaveCSS('padding-top', '16px');
  await expect(child).toHaveCSS('animation-name', 'fade-in');

  await child.evaluate(
    /** Record the transient exit style before the element can unmount. */
    (element) => {
      const observed: string[] = [];
      (
        window as Window & { leveruiPresenceExitAnimations?: string[] }
      ).leveruiPresenceExitAnimations = observed;
      const observer = new MutationObserver(
        /** Capture the closed style as the Presence attributes change. */
        () => {
          if (element.getAttribute('data-state') !== 'closed') return;
          observed.push(getComputedStyle(element).animationName);
          observer.disconnect();
        },
      );
      observer.observe(element, { attributes: true, attributeFilter: ['data-state', 'class'] });
    },
  );
  await page.getByTestId('presence-child-toggle').click();
  await expect(page.getByTestId('presence-child-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect
    .poll(
      /** Read the exit style captured before the child unmounted. */
      () =>
        page.evaluate(
          /** Return the recorded Presence animation names. */
          () =>
            (window as Window & { leveruiPresenceExitAnimations?: string[] })
              .leveruiPresenceExitAnimations ?? [],
        ),
    )
    .toContain('fade-out');
  await expect(child).toHaveCount(0);
  await expect(page.getByTestId('presence-child-exit-count')).toHaveText('1');
}

test('Presence asChild retains machine, styles, and both refs', verifiesPresenceAsChild);
