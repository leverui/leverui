const responsiveRequired = [];
for (const breakpoint of ['sm', 'md', 'lg', 'xl', '2xl']) {
  for (const suffix of [breakpoint, `${breakpoint}-down`]) {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'full']) {
      responsiveRequired.push(`[data-size-${suffix}='${size}']`);
    }
    for (const placement of ['start', 'end', 'top', 'bottom']) {
      responsiveRequired.push(`[data-placement-${suffix}='${placement}']`);
    }
    responsiveRequired.push(`[data-contained-${suffix}='true']`);
  }
}

/** Guard every authored Drawer part, finite choice, and responsive hook. */
export const drawerContracts = [
  {
    family: 'drawer',
    required: [
      '.lui-drawer__backdrop[data-lui-drawer-css]',
      '.lui-drawer__positioner[data-lui-drawer-css]',
      '.lui-drawer__content[data-lui-drawer-css]',
      '.lui-drawer__header[data-lui-drawer-css]',
      '.lui-drawer__body[data-lui-drawer-css]',
      '.lui-drawer__footer[data-lui-drawer-css]',
      '.lui-drawer__title[data-lui-drawer-css]',
      '.lui-drawer__description[data-lui-drawer-css]',
      '.lui-drawer__closeTrigger[data-lui-drawer-css]',
      "[data-size='full']",
      "[data-placement='start']",
      "[data-placement='bottom']",
      ...responsiveRequired,
      "[data-contained='true']",
      "[data-contained='false']",
      "[data-state='open']",
      "[data-state='closed']",
      '--lui-drawer-background',
      '--lui-drawer-max-width',
      '--lui-drawer-z-index',
    ],
  },
];
