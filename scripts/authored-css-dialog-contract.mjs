const parts = [
  'backdrop',
  'positioner',
  'content',
  'header',
  'body',
  'footer',
  'title',
  'description',
  'closeTrigger',
];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'cover', 'full'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Dialog's authored parts and every documented appearance choice. */
export const dialogContracts = [
  {
    family: 'dialog',
    required: [
      ...parts.map(
        /** Require one default CSS rule per styled public part. */
        (part) => `.leverui-dialog__${part}[data-leverui-dialog-css]`,
      ),
      ...sizes.map(
        /** Require each scalar size in the default stylesheet. */
        (size) => `[data-size='${size}']`,
      ),
      ...breakpoints.flatMap(
        /** Require each responsive size at both breakpoint directions. */
        (breakpoint) =>
          [breakpoint, `${breakpoint}-down`].flatMap(
            /** Require the complete finite size set at this breakpoint. */
            (suffix) =>
              sizes.map(
                /** Require this size at the selected responsive boundary. */
                (size) => `[data-size-${suffix}='${size}']`,
              ),
          ),
      ),
      ...['center', 'top', 'bottom'].map(
        /** Require the placement selectors used by the portal positioner. */
        (placement) => `[data-placement='${placement}']`,
      ),
      "[data-scroll-behavior='inside']",
      "[data-scroll-behavior='outside']",
      ...['scale', 'slide-in-bottom', 'slide-in-top', 'slide-in-left', 'slide-in-right'].map(
        /** Require each motion preset with an authored animation. */
        (preset) => `[data-motion-preset='${preset}']`,
      ),
      '--leverui-private-dialog-size-max-width',
    ],
  },
];
