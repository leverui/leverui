import { defineConfig, devices } from '@playwright/test';

const storybookPort = Number(process.env.LEVERUI_STORYBOOK_PORT ?? 6007);
const storybookHost = 'localhost';
const skipStorybookBuild = process.env.LEVERUI_STORYBOOK_SKIP_BUILD === '1';
const skipHydrationPrep = process.env.LEVERUI_STORYBOOK_SKIP_HYDRATION_PREP === '1';
const staticStorybook = process.env.LEVERUI_STORYBOOK_STATIC === '1';
const exampleGallery = process.env.LEVERUI_STORYBOOK_EXAMPLES === '1';
const switchGuideOnly = process.env.LEVERUI_SWITCH_GUIDE_ONLY === '1';
const releaseBrowsers = process.env.LEVERUI_RELEASE_BROWSERS === '1';
if (!Number.isInteger(storybookPort) || storybookPort < 1 || storybookPort > 65535) {
  throw new Error('LEVERUI_STORYBOOK_PORT must be a valid port number.');
}
const webServerCommands = [
  ...(!skipStorybookBuild ? ['pnpm build'] : []),
  ...(!switchGuideOnly && !skipHydrationPrep ? ['node scripts/prepare-browser-hydration.mjs'] : []),
  staticStorybook
    ? `pnpm exec vite preview --outDir .tmp/storybook-static --host ${storybookHost} --port ${storybookPort} --strictPort`
    : `pnpm exec storybook dev -p ${storybookPort} --host ${storybookHost} --ci`,
];

export default defineConfig({
  testDir: exampleGallery ? './tests/examples' : './tests/browser',
  ...(switchGuideOnly && { testMatch: '**/switch-guide-*.spec.ts' }),
  // GitHub's machines are slower, and gallery tests open many stories in one test.
  timeout: process.env.CI ? 180_000 : 60_000,
  expect: { timeout: 15_000 },
  workers: 2,
  use: {
    baseURL: `http://${storybookHost}:${storybookPort}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(releaseBrowsers
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        ]
      : []),
  ],
  webServer: {
    command: webServerCommands.join(' && '),
    env: { LEVERUI_STORYBOOK_INTERNAL: exampleGallery ? '0' : '1' },
    url: `http://${storybookHost}:${storybookPort}/index.json`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
