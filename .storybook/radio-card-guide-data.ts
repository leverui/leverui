export type GuideFramework = {
  readonly value: string;
  readonly title: string;
  readonly description: string;
  readonly addon: string;
};

/** Keep the guide's framework labels and metadata in one place. */
export const guideFrameworks: readonly GuideFramework[] = [
  {
    value: 'next',
    title: 'Next.js',
    description: 'Best for apps',
    addon: 'Most popular',
  },
  {
    value: 'vite',
    title: 'Vite',
    description: 'Best for SPAs',
    addon: 'Super fast dev server',
  },
  {
    value: 'astro',
    title: 'Astro',
    description: 'Best for static sites',
    addon: 'Great for blogs/docs',
  },
];

/** Match the two-item size, color, and variant examples. */
export const guideShortFrameworks: readonly GuideFramework[] = guideFrameworks.slice(0, 2);

export type GuidePayment = {
  readonly value: string;
  readonly title: string;
  readonly icon: 'wallet' | 'phone' | 'card';
};

/** Preserve the payment values shared by the three no-indicator examples. */
export const guidePayments: readonly GuidePayment[] = [
  { value: 'wallet', title: 'Wallet', icon: 'wallet' },
  { value: 'mobile-pay', title: 'Mobile pay', icon: 'phone' },
  { value: 'card', title: 'Card', icon: 'card' },
];

export const guideSizes = ['sm', 'md', 'lg'] as const;
export const guideVariants = ['surface', 'subtle', 'outline', 'solid'] as const;
export const guidePalettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;

/** Preserve the Explorer's longer descriptions and metadata labels. */
export const guideExplorerItems = [
  {
    value: 'next',
    title: 'Next.js',
    description: 'Great for full-stack web apps',
    addon: 'Most popular',
  },
  {
    value: 'vite',
    title: 'Vite',
    description: 'Fast and modern build tool for SPAs',
    addon: 'Super fast dev server',
  },
  {
    value: 'astro',
    title: 'Astro',
    description: 'Perfect for content-driven static sites',
    addon: 'Great for blogs/docs',
  },
] as const;
