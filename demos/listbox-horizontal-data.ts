/** Album data in the order used by the Horizontal guide. */
export const horizontalAlbums = [
  {
    value: 'red-morning',
    title: 'Red Morning',
    artist: 'Ada Linden',
    image: '/demo-images/scenes/cover-1.webp',
  },
  {
    value: 'violet-hour',
    title: 'Violet Hour',
    artist: 'Night Ferry',
    image: '/demo-images/scenes/cover-2.webp',
  },
  {
    value: 'distant-light',
    title: 'Distant Light',
    artist: 'The Far Field',
    image: '/demo-images/scenes/cover-3.webp',
  },
  {
    value: 'slow-tide',
    title: 'Slow Tide',
    artist: 'Blue Harbor',
    image: '/demo-images/scenes/cover-4.webp',
  },
  {
    value: 'signal-lines',
    title: 'Signal Lines',
    artist: 'Paper Circuit',
    image: '/demo-images/scenes/cover-5.webp',
  },
] as const;

export type HorizontalAlbum = {
  readonly value: string;
  readonly title: string;
  readonly artist: string;
  readonly image: string;
};

export const selectedHorizontalAlbum = 'violet-hour';
