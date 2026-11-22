/** Require orientation and current-page selectors in authored Carousel CSS. */
export const carouselContracts = [
  {
    family: 'carousel',
    required: [
      '.leverui-carousel__root',
      '.leverui-carousel__item',
      '.leverui-carousel__control',
      '.leverui-carousel__indicatorGroup',
      '.leverui-carousel__indicator',
      "[data-orientation='horizontal']",
      "[data-orientation='vertical']",
      '[data-current]',
    ],
  },
];
