export const imageColumns = [
  [
    '/demo-images/scenes/mountains.webp',
    '/demo-images/scenes/ocean.webp',
    '/demo-images/scenes/forest.webp',
    '/demo-images/scenes/city.webp',
  ],
  [
    '/demo-images/scenes/desert.webp',
    '/demo-images/scenes/valley.webp',
    '/demo-images/scenes/beach.webp',
    '/demo-images/scenes/home-villa.webp',
  ],
  [
    '/demo-images/scenes/sunset-lake.webp',
    '/demo-images/scenes/cover-1.webp',
    '/demo-images/scenes/cover-2.webp',
    '/demo-images/scenes/cover-3.webp',
  ],
] as const;

export interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly rating: number;
  readonly avatar: string;
  readonly content: string;
}

export const testimonials: readonly Testimonial[] = [
  {
    name: 'Iris Calder',
    role: 'Product designer',
    rating: 5,
    avatar: '/demo-images/avatars/avatar-5.webp',
    content:
      'We rebuilt our settings pages in a week. The components were easy to restyle for our brand.',
  },
  {
    name: 'Theo Park',
    role: 'Frontend developer',
    rating: 4,
    avatar: '/demo-images/avatars/avatar-2.webp',
    content: 'The marquee took ten minutes to set up, and it pauses when you hover over it.',
  },
  {
    name: 'Nadia Quill',
    role: 'CTO',
    rating: 5,
    avatar: '/demo-images/avatars/avatar-3.webp',
    content:
      'Keyboard support worked from the start. Our accessibility review found little to fix.',
  },
  {
    name: 'Oskar Brandt',
    role: 'Marketing lead',
    rating: 5,
    avatar: '/demo-images/avatars/avatar-4.webp',
    content: 'Our landing page was ready two days early, and the team can edit it themselves.',
  },
  {
    name: 'Rhea Solano',
    role: 'Solo founder',
    rating: 4,
    avatar: '/demo-images/avatars/avatar-1.webp',
    content: 'The docs answered most of my questions. I built my first version in one weekend.',
  },
];
