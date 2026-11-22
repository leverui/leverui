import { expect, type Locator } from '@playwright/test';

/**
 * Wait until a custom property resolves to an exact length. Minified CSS writes
 * `0.75rem` as `.75rem`, so compare the number and unit rather than the text.
 */
export async function expectCustomPropertyLength(
  locator: Locator,
  property: string,
  expected: string,
): Promise<void> {
  await expect
    .poll(() =>
      locator.evaluate(
        /** Split the resolved value into its number and unit. */
        (element, name) => {
          const value = getComputedStyle(element).getPropertyValue(name).trim();
          const match = /^(-?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/.exec(value);
          return match ? [Number(match[1]), match[2]] : [value];
        },
        property,
      ),
    )
    .toEqual([Number.parseFloat(expected), expected.replace(/^-?[\d.]+/, '')]);
}
