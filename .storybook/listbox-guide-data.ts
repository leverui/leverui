/** Framework options in the local Select All guide. */
export const selectAllFrameworks = [
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

/** The first four options shared by the local Extended Select guide. */
export const extendedFrameworks = selectAllFrameworks.slice(0, 4);
