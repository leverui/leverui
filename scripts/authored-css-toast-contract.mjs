/** Require Toast status and compound-part rules in the published CSS. */
export const toastContracts = [
  {
    family: 'toast',
    required: [
      '.lui-toast__root:not([data-unstyled])',
      ...['title', 'description', 'indicator', 'actionTrigger', 'closeTrigger'].map(
        /** Keep every styled public part in the default stylesheet. */
        (part) => `.lui-toast__${part}:not([data-unstyled])`,
      ),
      ...['warning', 'success', 'error'].map(
        /** Require each saturated status treatment. */
        (status) => `[data-type='${status}']`,
      ),
      "[data-state='closed']",
      'prefers-reduced-motion: reduce',
    ],
  },
];
