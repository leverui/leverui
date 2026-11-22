/** Require every public Number Input part and finite responsive stepper size. */
export const numberInputContracts = [
  {
    family: 'number-input',
    required: [
      '.leverui-number-input__root',
      '.leverui-number-input__input',
      '.leverui-number-input__control',
      '.leverui-number-input__incrementTrigger',
      '.leverui-number-input__decrementTrigger',
      '.leverui-number-input__valueText',
      '--leverui-number-input-stepper-width',
      '--leverui-number-input-stepper-radius',
      ...['', '-sm', '-md', '-lg', '-xl', '-2xl'].flatMap(
        /** Require all four authored stepper sizes at each breakpoint. */
        (suffix) =>
          ['xs', 'sm', 'md', 'lg'].map(
            /** Identify one responsive root size selector. */
            (size) => `[data-size${suffix}='${size}']`,
          ),
      ),
    ],
  },
];
