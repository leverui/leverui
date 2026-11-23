const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

export const groupContracts = [
  {
    family: 'group',
    required: [
      '.leverui-group',
      '.leverui-button-group',
      '--lui-group-gap',
      "[data-stacking='first-on-top']",
      "[data-stacking='last-on-top']",
      ...breakpoints.flatMap(
        /** Require joined axes and open alignment at every breakpoint. */
        (breakpoint) => [
          `[data-joined-${breakpoint}='horizontal']`,
          `[data-joined-${breakpoint}='vertical']`,
          `--lui-private-group-align-${breakpoint}`,
          `--lui-private-group-justify-${breakpoint}`,
          `--lui-private-group-wrap-${breakpoint}`,
        ],
      ),
      ...breakpoints.slice(1).flatMap(
        /** Require reversible responsive boolean and stacking choices. */
        (breakpoint) => [
          `[data-attached-${breakpoint}='true']`,
          `[data-attached-${breakpoint}='false']`,
          `[data-grow-${breakpoint}='true']`,
          `[data-grow-${breakpoint}='false']`,
          `[data-stacking-${breakpoint}='first-on-top']`,
          `[data-stacking-${breakpoint}='last-on-top']`,
        ],
      ),
    ],
  },
];
