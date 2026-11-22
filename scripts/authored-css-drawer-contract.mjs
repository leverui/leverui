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
      '.leverui-drawer__backdrop[data-leverui-drawer-css]',
      '.leverui-drawer__positioner[data-leverui-drawer-css]',
      '.leverui-drawer__content[data-leverui-drawer-css]',
      '.leverui-drawer__header[data-leverui-drawer-css]',
      '.leverui-drawer__body[data-leverui-drawer-css]',
      '.leverui-drawer__footer[data-leverui-drawer-css]',
      '.leverui-drawer__title[data-leverui-drawer-css]',
      '.leverui-drawer__description[data-leverui-drawer-css]',
      '.leverui-drawer__closeTrigger[data-leverui-drawer-css]',
      "[data-size='full']",
      "[data-placement='start']",
      "[data-placement='bottom']",
      ...responsiveRequired,
      "[data-contained='true']",
      "[data-contained='false']",
      "[data-state='open']",
      "[data-state='closed']",
      '--leverui-drawer-background',
      '--leverui-drawer-max-width',
      '--leverui-drawer-z-index',
    ],
  },
];
