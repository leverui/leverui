/** The exact collection used by the Disabled Item guide. */
export const disabledFrameworks = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue', disabled: true },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte', disabled: true },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'SolidJS', value: 'solid' },
] as const;

/** The media options in their visible collection order. */
export const groupedMedia = [
  { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
  { label: 'Saltwind', value: 'saltwind', category: 'Books' },
  { label: 'The Glass Orchard', value: 'the-glass-orchard', category: 'Books' },
  {
    label: 'The Quiet Harbor',
    value: 'the-quiet-harbor',
    category: 'Movies',
  },
  { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
  { label: 'The Last Lighthouse', value: 'the-last-lighthouse', category: 'Movies' },
] as const;

/** Framework options used by the Multiple Selection guide. */
export const multipleFrameworks = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
  { label: 'SolidJS', value: 'solid' },
] as const;

/** Preselected values used by the published hydration and visual fixtures. */
export const selectedCollectionValues = {
  disabled: ['react'],
  grouped: ['lanternwright'],
  multiple: ['react', 'angular'],
} as const;

/** Group a media item by the category field. */
export function mediaCategory(item: (typeof groupedMedia)[number]): string {
  return item.category;
}
