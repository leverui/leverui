/** Require every public Number Input part and finite responsive stepper size. */
export const numberInputContracts = [
  {
    family: 'number-input',
    required: [
      '.lui-number-input__root',
      '.lui-number-input__input',
      '.lui-number-input__control',
      '.lui-number-input__incrementTrigger',
      '.lui-number-input__decrementTrigger',
      '.lui-number-input__valueText',
      '--lui-number-input-stepper-width',
      '--lui-number-input-stepper-radius',
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
