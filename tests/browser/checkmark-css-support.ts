import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Checkmark as CheckmarkExport, CheckmarkProps } from '../../src';

const serverEntry = '../../dist/server/index.js';
const { Checkmark } = (await import(serverEntry)) as { Checkmark: typeof CheckmarkExport };
export const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one authored Checkmark choice without a styling provider. */
export function specimen(
  props: CheckmarkProps<'svg'> & Partial<Record<'data-invalid' | 'data-focus-visible', string>>,
): string {
  return renderToString(
    /** Keep the server markup script-free. */
    () => createComponent(Checkmark, props),
  );
}

/** Read computed SVG presentation for a CSS-only comparison. */
export async function appearance(page: Page, id: string): Promise<Record<string, string>> {
  return page.locator(`#${id}`).evaluate(
    /** Capture properties that distinguish the finite treatments. */
    (element) => {
      const style = getComputedStyle(element);
      return {
        width: style.width,
        padding: style.padding,
        color: style.color,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
      };
    },
  );
}
