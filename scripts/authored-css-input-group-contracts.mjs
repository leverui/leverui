/** Verify group-owned offsets and custom field hooks at each breakpoint. */
export const inputGroupContracts = [
  {
    family: 'input-group',
    required: [
      '.leverui-input-group:not([data-unstyled])',
      '[data-leverui-input-group-start-element]',
      'pointer-events: none',
      '.leverui-input-group__field',
      '.leverui-input',
      '.leverui-number-input__input',
      '.leverui-native-select__field',
      '--lui-input-group-field-height',
      ...['', '-sm', '-md', '-lg', '-xl', '-2xl'].flatMap(
        /** Require both logical sides of every supported responsive offset. */
        (suffix) => [`[data-group-start${suffix}]`, `[data-group-end${suffix}]`],
      ),
    ],
  },
];
