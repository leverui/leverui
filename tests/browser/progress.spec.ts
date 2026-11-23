import { expect, test, type Page } from '@playwright/test';

/** Check the primitive semantics and the visual size variants. */
async function verifiesProgressSemantics({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=feedback-progress--contract');
  const track = page.getByTestId('progress-track');
  const range = page.getByTestId('progress-range');
  await expect(track).toHaveAttribute('role', 'progressbar', { timeout: 15_000 });
  await expect(page.getByRole('progressbar', { name: 'Uploading' })).toBeVisible();
  await expect(track).toHaveAttribute('aria-valuenow', '40');
  await expect(track).toHaveAttribute('aria-valuemin', '0');
  await expect(track).toHaveAttribute('aria-valuemax', '100');
  await expect(range).toHaveAttribute('style', /width: 40%/);
  await expect(page.getByTestId('progress-value')).toHaveText('40%');
  await expect(page.getByTestId('progress-xs-track')).toHaveCSS('height', '6px');
  await expect(page.getByTestId('progress-lg-track')).toHaveCSS('height', '12px');
  await expect(page.getByTestId('progress-subtle-range')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('progress-striped-range')).toHaveCSS(
    'animation-name',
    'bg-position',
  );
  await expect(page.getByTestId('progress-responsive-track')).toHaveCSS('height', '8px');
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByTestId('progress-responsive-track')).toHaveCSS('height', '16px');
  for (const attribute of ['size', 'variant', 'striped', 'animated', 'recipe', 'unstyled']) {
    await expect(page.getByTestId('progress-striped')).not.toHaveAttribute(attribute);
  }
}

test('Progress preserves the primitive semantics and recipe variants', verifiesProgressSemantics);

/** Verify indeterminate and vertical machine output. */
async function verifiesProgressStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress--contract');
  const track = page.getByTestId('progress-indeterminate-track');
  await expect(track).toHaveAttribute('role', 'progressbar', { timeout: 15_000 });
  await expect(track).not.toHaveAttribute('aria-valuenow');
  await expect(page.getByTestId('progress-indeterminate-range')).toHaveAttribute(
    'data-state',
    'indeterminate',
  );
  await expect(page.getByTestId('progress-indeterminate-value')).toHaveText('');
  await expect(page.getByTestId('progress-vertical-track')).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
  await expect(page.getByTestId('progress-vertical-range')).toHaveCSS('height', '20px');
}

test('Progress preserves indeterminate and vertical machine states', verifiesProgressStates);

/** Verify controlled, inherited, and external updates retain mounted nodes. */
async function verifiesReactiveProgress({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress--contract');
  const range = page.getByTestId('progress-reactive-range');
  const external = page.getByTestId('progress-external-range');
  await expect(range).toHaveAttribute('style', /width: 25%/, { timeout: 15_000 });
  await range.evaluate(
    /** Mark the original native range before controlled updates. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('progress-toggle').click();
  await expect(page.getByTestId('progress-reactive-track')).toHaveCSS('height', '12px');
  await expect(range).toHaveAttribute('data-original-node', 'true');
  await expect(page.getByTestId('progress-reactive-value')).toHaveText('75%');
  await expect(range).toHaveAttribute('style', /width: 75%/);
  await external.evaluate(
    /** Mark the original external range before a machine event. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('progress-external-toggle').click();
  await expect(page.getByTestId('progress-external-track')).toHaveAttribute('aria-valuenow', '80');
  await expect(external).toHaveAttribute('data-original-node', 'true');
}

test(
  'Progress updates controlled and external machines on existing nodes',
  verifiesReactiveProgress,
);

/** Respect reduced motion while preserving visible progress state. */
async function verifiesReducedMotion({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=feedback-progress--contract');
  const striped = page.getByTestId('progress-striped-range');
  const indeterminate = page.getByTestId('progress-indeterminate-range');
  await expect(striped).toHaveCSS('animation-name', 'none', { timeout: 15_000 });
  await expect(indeterminate).toHaveCSS('animation-name', 'none');
  await expect(striped).toHaveCSS('transition-duration', '0s');
  await expect(indeterminate).toHaveAttribute('data-state', 'indeterminate');
}

test('Progress suppresses motion when the user requests reduced motion', verifiesReducedMotion);

/** Verify consumer CSS wins while unstyled roots retain the primitive semantics. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress--contract');
  await page.addStyleTag({
    content: `
      [data-testid='progress-default'] { --lui-progress-track-height: 17px; }
      .consumer-progress-range { background-color: rgb(12, 34, 56); }
    `,
  });
  await expect(page.getByTestId('progress-track')).toHaveCSS('height', '17px');
  await expect(page.getByTestId('progress-range')).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  const unstyledTrack = page.getByTestId('progress-unstyled-track');
  await expect(unstyledTrack).toHaveAttribute('role', 'progressbar');
  await expect(unstyledTrack).toHaveAttribute('aria-valuenow', '35');
  await expect(unstyledTrack).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('progress-unstyled-range')).toHaveAttribute('data-unstyled', '');
  await expect(unstyledTrack).toHaveCSS('height', '0px');
}

test('Progress accepts consumer CSS and unstyled composition', verifiesConsumerCss);
