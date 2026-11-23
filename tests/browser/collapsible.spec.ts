import { expect, test, type Page } from '@playwright/test';

/** Verify click and keyboard disclosure preserve the primitive's native attributes. */
async function verifiesBasicDisclosure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--basic');
  const trigger = page.getByTestId('collapsible-trigger');
  const content = page.getByTestId('collapsible-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toHaveAttribute('type', 'button');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toBeHidden();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Collapsible content has no ID.');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(content).toBeVisible();
  await expect(page.getByTestId('collapsible-indicator')).toHaveAttribute('data-state', 'open');
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
}

test(
  'Collapsible toggles with keyboard and preserves disclosure attributes',
  verifiesBasicDisclosure,
);

/** Verify controlled state and context closure share one primitive machine. */
async function verifiesControlledState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-behavior--controlled');
  const state = page.getByTestId('collapsible-controlled-state');
  const content = page.getByTestId('collapsible-controlled-content');
  await expect(state).toHaveText('closed', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Open externally' }).click();
  await expect(state).toHaveText('open');
  await expect(content).toBeVisible();
  await page.getByRole('button', { name: 'Close from context' }).click();
  await expect(state).toHaveText('closed');
  await expect(content).toBeHidden();
}

test('Collapsible follows external state and closes through context', verifiesControlledState);

/** Preserve a collapsed preview without hiding its subtree. */
async function verifiesPartialHeight({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--partial-height');
  const content = page.getByTestId('collapsible-partial-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-has-collapsed-size', '');
  await expect(content).toHaveCSS('max-height', '64px');
  await page.getByRole('button', { name: 'Toggle preview' }).click();
  await expect(content).toHaveAttribute('data-state', 'open');
  await expect(content).not.toHaveCSS('max-height', '64px');
}

test('Collapsible keeps a visible partial-height preview', verifiesPartialHeight);

/** Keep disabled content closed despite pointer or keyboard activation. */
async function verifiesDisabledState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--disabled');
  const trigger = page.getByTestId('collapsible-disabled-trigger');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toHaveAttribute('data-disabled', '');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  // The disabled trigger is a natively disabled button, so force the click.
  await expect(trigger).toBeDisabled();
  await trigger.click({ force: true });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('collapsible-disabled-content')).toBeHidden();
  await page.getByRole('button', { name: 'Enable disclosure' }).click();
  await expect(trigger).not.toHaveAttribute('data-disabled');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

test('Collapsible ignores activation while disabled', verifiesDisabledState);

/** Mount content on first open and remove it after the closing transition. */
async function verifiesLazyPresence({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--lazy-mounted');
  const content = page.getByTestId('collapsible-lazy-content');
  const trigger = page.getByRole('button', { name: 'Toggle lazy content' });
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await trigger.click();
  await expect(content).toHaveCount(0);
}

test('Collapsible lazy-mounts and unmounts its content', verifiesLazyPresence);

/** Keep the caller-owned machine in control of RootProvider's open state. */
async function verifiesCallerOwnedMachine({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-behavior--caller-owned');
  const state = page.getByTestId('collapsible-external-state');
  const content = page.getByTestId('collapsible-external-content');
  await expect(state).toHaveText('open', { timeout: 30_000 });
  await expect(content).toBeVisible();
  await page.getByRole('button', { name: 'Toggle external machine' }).click();
  await expect(state).toHaveText('closed');
  await expect(content).toBeHidden();
}

test('Collapsible RootProvider follows a caller-owned machine', verifiesCallerOwnedMachine);

/** Apply reactive provider styling without replacing caller-owned state. */
async function verifiesProviderDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-provider--defaults');
  const owned = page.getByTestId('collapsible-owned-root');
  const caller = page.getByTestId('collapsible-provider-root');
  await expect(owned).toBeVisible({ timeout: 30_000 });
  await expect(owned).toHaveAttribute('data-state', 'open');
  await expect(caller).toHaveAttribute('data-state', 'closed');
  await expect(owned).toHaveCSS('padding', '8px');
  await expect(caller).toHaveCSS('padding', '8px');
  await page.getByRole('button', { name: 'Increase inherited padding' }).click();
  await expect(owned).toHaveCSS('padding', '20px');
  await expect(caller).toHaveCSS('padding', '20px');
  await expect(caller).toHaveAttribute('data-state', 'closed');
}

test(
  'Collapsible PropsProvider styles both roots but owns only its Root',
  verifiesProviderDefaults,
);

/** Keep native child elements, machine behavior, and the caller ref. */
async function verifiesChildRenderers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-behavior--child-renderers');
  const root = page.getByTestId('collapsible-child-root');
  const trigger = page.getByTestId('collapsible-child-trigger');
  const content = page.getByTestId('collapsible-child-content');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('data-caller-ref', 'attached');
  await expect(trigger).toHaveJSProperty('tagName', 'BUTTON');
  await expect(content).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('collapsible-child-indicator')).toHaveAttribute(
    'data-state',
    'open',
  );
}

test('Collapsible child renderers retain native tags, ref, and behavior', verifiesChildRenderers);

/** Confirm consumer CSS overrides the authored content presentation. */
async function verifiesConsumerOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--basic');
  const content = page.getByTestId('collapsible-content');
  await expect(content).toBeAttached({ timeout: 30_000 });
  await page.addStyleTag({
    content: '.lui-collapsible__content { overflow: visible; animation-duration: 700ms; }',
  });
  await page.getByTestId('collapsible-trigger').click();
  await expect(content).toHaveCSS('overflow', 'visible');
  await expect(content).toHaveCSS('animation-duration', '0.7s');
}

/** Preserve disclosure while unstyled removes the default content rules. */
async function verifiesUnstyledDisclosure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible-behavior--unstyled');
  const root = page.getByTestId('collapsible-unstyled-root');
  const content = page.getByTestId('collapsible-unstyled-content');
  const trigger = page.getByRole('button', { name: 'Toggle unstyled details' });
  await expect(root).toHaveAttribute('data-unstyled', '', { timeout: 30_000 });
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).toHaveCSS('overflow', 'visible');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

test('Collapsible accepts consumer CSS overrides', verifiesConsumerOverride);
test('unstyled Collapsible retains disclosure without default CSS', verifiesUnstyledDisclosure);
