const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
const required = [
  '.lui-icon:not([data-unstyled])',
  '--lui-icon-size',
  'display: inline-block',
  'line-height: 1em',
  'flex-shrink: 0',
  'color: currentColor',
  'vertical-align: middle',
];

for (const size of sizes) required.push(`[data-size='${size}']`);
for (const breakpoint of breakpoints) {
  required.push(`[data-size-${breakpoint}='inherit']`);
  for (const size of sizes) required.push(`[data-size-${breakpoint}='${size}']`);
}

/** Require authored Icon choices at every supported responsive breakpoint. */
export const iconContracts = [
  { family: 'icon', files: ['icon-base.css', 'icon-responsive.css'], required },
];
