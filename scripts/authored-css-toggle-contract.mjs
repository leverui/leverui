/** Guard Toggle's public part hooks and empty-indicator behavior. */
export const toggleContracts = [
  {
    family: 'toggle',
    required: [
      '.lui-toggle__root',
      '.lui-toggle__indicator',
      ':empty',
      '--lui-toggle-empty-indicator-display',
    ],
  },
];
