import { expect, type Page } from '@playwright/test';

/** Align Chromium's reported platform with the host's native modifier gesture. */
export async function alignGuidePlatform(page: Page): Promise<void> {
  await page.addInitScript(
    /** Correct Chromium's Windows UA hint when the native browser is on macOS. */
    () => {
      const agent = (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData;
      if (/^Mac/i.test(navigator.platform) && agent && !/^Mac/i.test(agent.platform ?? '')) {
        Object.defineProperty(navigator, 'userAgentData', {
          configurable: true,
          value: new Proxy(agent, {
            /** Change only the platform hint and retain native client-hint behavior. */
            get(target, property): unknown {
              if (property === 'platform') return 'macOS';
              const value: unknown = Reflect.get(target, property, target);
              return typeof value === 'function' ? value.bind(target) : value;
            },
          }),
        });
      }
    },
  );
}

/** Ensure Chromium platform alignment leaves its other client hints available. */
export async function expectGuidePlatformCapabilities(page: Page): Promise<void> {
  if (page.context().browser()?.browserType().name() !== 'chromium') return;
  const capabilities = await page.evaluate(
    /** Inspect the three browser capabilities used by client-hint consumers. */
    () => {
      const agent = (
        navigator as Navigator & {
          userAgentData?: { brands?: unknown; mobile?: unknown; getHighEntropyValues?: unknown };
        }
      ).userAgentData;
      return {
        brands: Array.isArray(agent?.brands),
        mobile: typeof agent?.mobile === 'boolean',
        highEntropy: typeof agent?.getHighEntropyValues === 'function',
      };
    },
  );
  expect(capabilities).toEqual({ brands: true, mobile: true, highEntropy: true });
}

/** Use the modifier Zag expects for the page's normalized platform. */
export async function guideModifier(page: Page): Promise<'Meta' | 'Control'> {
  const platform = await page.evaluate(
    /** Match Zag's userAgentData-first platform detection. */
    () =>
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
        ?.platform ?? navigator.platform,
  );
  return /^Mac/i.test(platform) ? 'Meta' : 'Control';
}
