const styledParts = [
  'positioner',
  'content',
  'dragTrigger',
  'header',
  'title',
  'body',
  'resizeTrigger',
];

/** Guard FloatingPanel's authored parts, state, geometry, and public tokens. */
export const floatingPanelContracts = [
  {
    family: 'floating-panel',
    required: [
      ...styledParts.map(
        /** Require each default styled part under its opt-out attribute. */
        (part) => `.lui-floating-panel__${part}[data-lui-floating-panel-css]`,
      ),
      "[data-state='open']",
      "[data-placement='n']",
      "[data-placement='s']",
      "[data-placement='e']",
      "[data-placement='w']",
      "[data-placement='ne']",
      "[data-placement='nw']",
      "[data-placement='se']",
      "[data-placement='sw']",
      '--lui-colors-bg-panel',
      '--lui-colors-bg-subtle',
    ],
  },
];
