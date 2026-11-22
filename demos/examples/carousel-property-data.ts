export interface CarouselProperty {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly nights: number;
  readonly rating: number;
  readonly image: string;
  readonly favorite?: boolean;
}

export const carouselProperties: readonly CarouselProperty[] = [
  {
    id: 1,
    title: 'Brick loft in the old town',
    price: 148,
    nights: 2,
    rating: 4.92,
    image: '/demo-images/scenes/home-loft.webp',
    favorite: true,
  },
  {
    id: 2,
    title: 'Modern house with a heated pool',
    price: 284,
    nights: 2,
    rating: 4.99,
    image: '/demo-images/scenes/home-beach-studio.webp',
    favorite: true,
  },
  {
    id: 3,
    title: 'Mountain cabin with valley views',
    price: 241,
    nights: 2,
    rating: 4.94,
    image: '/demo-images/scenes/home-retreat.webp',
  },
  {
    id: 4,
    title: 'Sunny flat near the park',
    price: 126,
    nights: 2,
    rating: 4.87,
    image: '/demo-images/scenes/home-sunny-flat.webp',
  },
  {
    id: 5,
    title: 'Open-plan city studio',
    price: 189,
    nights: 2,
    rating: 4.83,
    image: '/demo-images/scenes/home-city-studio.webp',
    favorite: true,
  },
  {
    id: 6,
    title: 'Glass-front house on the hill',
    price: 262,
    nights: 2,
    rating: 4.96,
    image: '/demo-images/scenes/home-luxury.webp',
  },
  {
    id: 7,
    title: 'Cozy room on a quiet street',
    price: 139,
    nights: 2,
    rating: 4.81,
    image: '/demo-images/scenes/home-cozy-nest.webp',
    favorite: true,
  },
  {
    id: 8,
    title: 'Garden villa with a pool',
    price: 420,
    nights: 2,
    rating: 4.98,
    image: '/demo-images/scenes/home-villa.webp',
  },
] as const;
