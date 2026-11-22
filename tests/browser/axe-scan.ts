import type { Page } from '@playwright/test';
import axe from 'axe-core';

export interface WcagViolation {
  id: string;
  nodes: number;
}

const concurrentRetries = 20;
const retryDelayMs = 250;

/** Scan WCAG A and AA after Storybook's automatic axe scan has finished. */
export async function scanWcagViolations(page: Page, selector?: string): Promise<WcagViolation[]> {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(
    /** Retry only the concurrent-run error from Storybook's a11y addon. */
    async ({ target, retries, delayMs }) => {
      const engine = (window as Window & { axe?: typeof axe }).axe;
      if (!engine) throw new Error('The accessibility scanner did not load.');
      const options: axe.RunOptions = {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      };
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          const result = target ? await engine.run(target, options) : await engine.run(options);
          return result.violations.map(
            /** Preserve the failed rule and affected-node count for diagnostics. */
            (violation) => ({ id: violation.id, nodes: violation.nodes.length }),
          );
        } catch (error) {
          if (
            !(error instanceof Error) ||
            !error.message.startsWith('Axe is already running.') ||
            attempt === retries
          ) {
            throw error;
          }
          await new Promise<void>(
            /** Let the in-flight Storybook scan release axe's shared lock. */
            (resolve) => window.setTimeout(resolve, delayMs),
          );
        }
      }
      throw new Error('The accessibility scan retry limit was exceeded.');
    },
    { target: selector, retries: concurrentRetries, delayMs: retryDelayMs },
  );
}
