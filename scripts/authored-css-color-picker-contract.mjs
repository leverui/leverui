const styledParts = [
  'root',
  'label',
  'valueText',
  'control',
  'swatchTrigger',
  'trigger',
  'content',
  'area',
  'areaBackground',
  'areaThumb',
  'channelSlider',
  'channelSliderTrack',
  'channelSliderThumb',
  'channelInput',
  'transparencyGrid',
  'swatchGroup',
  'swatchIndicator',
  'formatSelect',
  'view',
  'channelText',
];
const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const variants = ['outline', 'subtle'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Color Picker's styled parts and all finite presentation choices. */
export const colorPickerContracts = [
  {
    family: 'color-picker',
    required: [
      ...styledParts.map(
        /** Require an authored default for each styled part. */
        (part) => `.leverui-color-picker__${part}[data-leverui-color-picker-css]`,
      ),
      '.leverui-color-picker__swatch.leverui-color-swatch[data-leverui-color-picker-css]',
      ...sizes.map(
        /** Require each scalar size rule. */
        (size) => `[data-size='${size}']`,
      ),
      ...variants.map(
        /** Require each scalar treatment rule. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...breakpoints.flatMap(
        /** Require responsive size and treatment rules. */
        (breakpoint) => [
          ...sizes.map(
            /** Require this size at the selected breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...variants.map(
            /** Require this treatment at the selected breakpoint. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '[data-disabled]',
      ':focus-visible',
    ],
  },
];
