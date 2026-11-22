import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { EnvironmentProvider as EnvironmentProviderExport } from '../../src';

type ServerExports = { EnvironmentProvider: typeof EnvironmentProviderExport };
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Render the published provider without reading browser globals on the server. */
function renderServerEnvironment(): string {
  return renderToString(
    /** Construct the provider through the package server entry. */
    () => createComponent(components.EnvironmentProvider, { children: 'Server content' }),
  );
}

/** Require one portal inside the expected physical DOM root. */
async function expectPortalRoot(page: Page, testId: string, shadow: boolean): Promise<void> {
  const portal = page.getByTestId(testId);
  await expect(portal).toHaveCount(1);
  await expect
    .poll(
      /** Observe the portal destination after a reactive root change. */
      () =>
        portal.evaluate(
          /** Read the portal element's actual root. */
          (element) => element.getRootNode() instanceof ShadowRoot,
        ),
    )
    .toBe(shadow);
}

/** Verify root lookup, nesting, reactivity, and default portal mounts. */
async function verifiesEnvironmentRoots({ page }: { page: Page }): Promise<void> {
  expect(renderServerEnvironment()).toContain('Server content');
  await page.goto('/iframe.html?id=utilities-environment--roots');
  const story = page.getByTestId('environment-story');
  await expect(story).toBeVisible();
  await expect(page.getByTestId('environment-default')).toHaveAttribute('data-root', 'document');
  await expect(page.getByTestId('environment-reactive')).toHaveAttribute('data-root', 'document');
  await expect(page.getByTestId('environment-direct')).toHaveAttribute('data-root', 'document');
  await expectPortalRoot(page, 'environment-reactive-portal', false);
  await expectPortalRoot(page, 'environment-direct-portal', false);
  await expect(page.getByTestId('environment-shadow')).toHaveAttribute('data-root', 'shadow');
  await expect(page.getByTestId('environment-element')).toHaveAttribute('data-root', 'element');
  await expect(page.getByTestId('environment-element')).toHaveAttribute('data-matches', 'true');
  await expect(page.getByTestId('environment-element')).toHaveAttribute('data-document', 'main');
  await expect(page.getByTestId('environment-element')).toHaveAttribute('data-window', 'main');
  await expect(page.getByTestId('environment-element-portal')).toBeVisible();
  expect(
    await page.getByTestId('environment-element-portal').evaluate(
      /** Confirm the element's default portal destination is its containing shadow root. */
      (element) => {
        const root = element.getRootNode();
        return (
          root instanceof ShadowRoot &&
          root.host.getAttribute('data-testid') === 'environment-shadow-host'
        );
      },
    ),
  ).toBe(true);
  await page.getByTestId('environment-toggle').click();
  await expect(page.getByTestId('environment-reactive')).toHaveAttribute('data-root', 'shadow');
  await expect(page.getByTestId('environment-direct')).toHaveAttribute('data-root', 'shadow');
  await expectPortalRoot(page, 'environment-reactive-portal', true);
  await expectPortalRoot(page, 'environment-direct-portal', true);
  await page.getByTestId('environment-toggle').click();
  await expect(page.getByTestId('environment-reactive')).toHaveAttribute('data-root', 'document');
  await expect(page.getByTestId('environment-direct')).toHaveAttribute('data-root', 'document');
  await expectPortalRoot(page, 'environment-reactive-portal', false);
  await expectPortalRoot(page, 'environment-direct-portal', false);
  await expect(page.getByTestId('environment-nested')).toHaveAttribute('data-root', 'document');
  await expect(page.getByTestId('environment-shadow-portal')).toBeVisible();
  await expect(page.getByTestId('environment-explicit-portal')).toBeVisible();
  await expect(page.getByTestId('environment-nested-portal')).toBeVisible();
  expect(
    await page.getByTestId('environment-shadow-portal').evaluate(
      /** Identify the physical mount root of the shadow portal. */
      (element) => element.getRootNode() instanceof ShadowRoot,
    ),
  ).toBe(true);
  expect(
    await page.getByTestId('environment-explicit-portal').evaluate(
      /** Confirm an explicit mount overrides the environment root. */
      (element) =>
        element.parentElement?.parentElement?.dataset.testid === 'environment-explicit-host',
    ),
  ).toBe(true);
  expect(
    await page.getByTestId('environment-nested-portal').evaluate(
      /** Identify the nested override's physical mount root. */
      (element) => element.getRootNode() === document,
    ),
  ).toBe(true);
  await expect(page.getByTestId('environment-iframe')).toHaveAttribute('data-document', 'other');
  await expect(page.getByTestId('environment-iframe')).toHaveAttribute('data-window', 'other');
  await expect(
    page.frameLocator('[data-testid="environment-frame"]').getByTestId('environment-iframe-portal'),
  ).toBeVisible();
}

test('EnvironmentProvider scopes hooks and default portals', verifiesEnvironmentRoots);
