import { expect, type Locator } from '@playwright/test';

/** Fixed guide values, independent of the Storybook collection. */
const selectAllOptions = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'SolidJS', value: 'solid' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
  { label: 'Remix', value: 'remix' },
  { label: 'Gatsby', value: 'gatsby' },
  { label: 'Ember.js', value: 'ember' },
  { label: 'Preact', value: 'preact' },
] as const;

export type ListboxGuide = 'select-all' | 'extended';

/** Assert every option's accessible label and stable machine value in order. */
export async function expectGuideOptions(options: Locator, guide: ListboxGuide): Promise<void> {
  const expected = guide === 'select-all' ? selectAllOptions : selectAllOptions.slice(0, 4);
  await expect(options).toHaveCount(expected.length, { timeout: 30_000 });
  for (const [index, item] of expected.entries()) {
    await expect(options.nth(index)).toHaveAccessibleName(item.label);
    await expect(options.nth(index)).toHaveAttribute('data-value', item.value);
  }
}
