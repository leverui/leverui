## Browser Tests

jsdom does not load CSS or calculate layout. It cannot confirm overlay
positions, computed styles, animations, or hydration. Check those in Playwright
against a `vite build` of your app. This spec drives the dialog from the
previous section.

```sh
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'pnpm exec vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
  },
});
```

```ts
// e2e/dialog.spec.ts
import { expect, test } from '@playwright/test';

test('moves focus into the dialog and restores it on Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open' });

  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Account' });
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
```
