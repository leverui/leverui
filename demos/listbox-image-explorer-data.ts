/** Keep the explorer's labels, descriptions, and image sources. */
export const explorerImages = [
  {
    label: 'Snowy peaks',
    value: 'mountains',
    description: 'Mountains under a pink evening sky',
    url: '/demo-images/scenes/mountains.webp',
  },
  {
    label: 'Breaking wave',
    value: 'ocean',
    description: 'A wave rising under evening clouds',
    url: '/demo-images/scenes/ocean.webp',
  },
  {
    label: 'Woodland trail',
    value: 'forest',
    description: 'A dirt path through green trees',
    url: '/demo-images/scenes/forest.webp',
  },
  {
    label: 'Skyline at night',
    value: 'city',
    description: 'City lights reflected in the water',
    url: '/demo-images/scenes/city.webp',
  },
  {
    label: 'Sand dunes',
    value: 'desert',
    description: 'Wind ripples on golden sand',
    url: '/demo-images/scenes/desert.webp',
  },
] satisfies readonly ExplorerImage[];

export type ExplorerImage = {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly url: string;
};
