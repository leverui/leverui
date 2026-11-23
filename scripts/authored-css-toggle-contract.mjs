/** Guard Toggle's public part hooks and empty-indicator behavior. */
export const toggleContracts = [
  {
    family: 'toggle',
    required: [
      '.leverui-toggle__root',
      '.leverui-toggle__indicator',
      ':empty',
      '--lui-toggle-empty-indicator-display',
    ],
  },
];
