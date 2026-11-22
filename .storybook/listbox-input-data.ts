/** Keep the guide's filterable framework order and labels. */
export const filterFrameworks = [
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
];

export const priorityFrameworks = filterFrameworks.slice(0, 4);
export type ListboxFramework = (typeof filterFrameworks)[number];
