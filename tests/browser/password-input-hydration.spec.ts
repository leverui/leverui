import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type {
  PasswordInput as PasswordInputExport,
  PasswordStrengthMeter as PasswordStrengthMeterExport,
} from '../../src';
import { renderPasswordHydrationTree } from '../../.storybook/password-input-hydration-tree';

type ServerComponents = {
  PasswordInput: typeof PasswordInputExport;
  PasswordStrengthMeter: typeof PasswordStrengthMeterExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser tree to the already mounted server controls. */
async function hydratePasswordInBrowser(): Promise<void> {
  const modulePath = '/.storybook/password-input-hydration-example.tsx';
  const { hydratePasswordInputExample } = await import(modulePath);
  const root = document.getElementById('password-hydration-root');
  if (!root) throw new Error('Password hydration root was not found.');
  hydratePasswordInputExample(root);
}

/** Keep input value, nodes, and authored presentation through hydration. */
async function verifiesPasswordHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published server components before loading the browser. */
    () => renderPasswordHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="password-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-password-root');
  const input = root.getByLabel('Hydrated password');
  const meter = page.getByTestId('hydrated-strength-meter');
  await expect(input).toHaveValue('secret');
  await expect(meter).toHaveAttribute('data-strength-level', 'high');
  await input.fill('typed before hydration');
  await input.evaluate(
    /** Mark the original native input to detect replacement. */
    (element) => {
      element.setAttribute('data-server-node', 'true');
    },
  );
  await meter.evaluate(
    /** Mark the original strength meter to detect replacement. */
    (element) => {
      element.setAttribute('data-server-node', 'true');
    },
  );
  const errors: string[] = [];

  /** Record client failures at the hydration boundary. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePasswordInBrowser);
  await expect(page.locator('#password-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(input).toHaveAttribute('data-server-node', 'true');
  await expect(meter).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveValue('typed before hydration');
  await root.getByRole('button', { name: 'Toggle password visibility' }).click();
  await expect(input).toHaveAttribute('type', 'text');
}

test(
  'published Password Input hydrates without replacing native controls',
  verifiesPasswordHydration,
);
