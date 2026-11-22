export const checkmarkFrameworks = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
  { label: 'SolidJS', value: 'solid' },
];

export const describedFrameworks = [
  {
    label: 'React.js',
    value: 'react',
    description: 'A JavaScript library for building user interfaces',
  },
  { label: 'Vue.js', value: 'vue', description: 'The progressive JavaScript framework' },
  {
    label: 'Angular',
    value: 'angular',
    description: 'Platform for building mobile and desktop web applications',
  },
  { label: 'Svelte', value: 'svelte', description: 'Cybernetically enhanced web apps' },
  { label: 'Next.js', value: 'nextjs', description: 'A full-stack web framework' },
  { label: 'SolidJS', value: 'solid', description: 'A reactive JavaScript UI library' },
];

export const iconFrameworks = [
  { label: 'React.js', value: 'react', icon: 'atom' },
  { label: 'Vue.js', value: 'vue', icon: 'palette' },
  { label: 'Angular', value: 'angular', icon: 'globe' },
  { label: 'Svelte', value: 'svelte', icon: 'zap' },
  { label: 'SolidJS', value: 'solid', icon: 'sparkles' },
] as const;

export type FrameworkIconKind = (typeof iconFrameworks)[number]['icon'];
