/** Require orientation and current-page selectors in authored Carousel CSS. */
export const carouselContracts = [
  {
    family: 'carousel',
    required: [
      '.lui-carousel__root',
      '.lui-carousel__item',
      '.lui-carousel__control',
      '.lui-carousel__indicatorGroup',
      '.lui-carousel__indicator',
      "[data-orientation='horizontal']",
      "[data-orientation='vertical']",
      '[data-current]',
    ],
  },
];
