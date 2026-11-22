/** Static viewport thresholds shared by CSS-first responsive hooks. */
export const breakpointThresholds = [
  { name: 'base', min: '0px' },
  { name: 'sm', min: '480px' },
  { name: 'md', min: '768px' },
  { name: 'lg', min: '1024px' },
  { name: 'xl', min: '1280px' },
  { name: '2xl', min: '1536px' },
] as const;

/** Names accepted by CSS-first viewport and responsive value hooks. */
export type BreakpointName = (typeof breakpointThresholds)[number]['name'];
