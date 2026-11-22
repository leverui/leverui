import { expect, type Locator } from '@playwright/test';
import type { ListboxCollectionGuide } from '../../.storybook/listbox-collection-guide-tree';

/** Fixed labels and values, independent of Storybook data. */
const expectedOptions = {
  disabled: [
    ['React.js', 'react'],
    ['Vue.js', 'vue'],
    ['Angular', 'angular'],
    ['Svelte', 'svelte'],
    ['Next.js', 'nextjs'],
    ['SolidJS', 'solid'],
  ],
  grouped: [
    ['Lanternwright', 'lanternwright'],
    ['Saltwind', 'saltwind'],
    ['The Glass Orchard', 'the-glass-orchard'],
    ['The Quiet Harbor', 'the-quiet-harbor'],
    ['Midnight Ferry', 'midnight-ferry'],
    ['The Last Lighthouse', 'the-last-lighthouse'],
  ],
  multiple: [
    ['React.js', 'react'],
    ['Vue.js', 'vue'],
    ['Angular', 'angular'],
    ['Svelte', 'svelte'],
    ['Next.js', 'nextjs'],
    ['Nuxt.js', 'nuxtjs'],
    ['SolidJS', 'solid'],
  ],
} as const;

/** Check every guide option's accessible name and stable collection value. */
export async function expectCollectionGuideOptions(
  options: Locator,
  guide: ListboxCollectionGuide,
): Promise<void> {
  const expected = expectedOptions[guide];
  await expect(options).toHaveCount(expected.length);
  for (const [index, [label, value]] of expected.entries()) {
    await expect(options.nth(index)).toHaveAccessibleName(label);
    await expect(options.nth(index)).toHaveAttribute('data-value', value);
  }
}

/** Require the machine's active descendant to name the highlighted item. */
export async function expectCollectionGuideActive(
  listbox: Locator,
  option: Locator,
): Promise<void> {
  await expect(option).toHaveAttribute('data-highlighted');
  await expect(option).toHaveAttribute('id', /.+/);
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await option.getAttribute('id')) ?? '',
  );
}
