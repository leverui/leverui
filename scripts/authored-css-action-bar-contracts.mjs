/** Require Action Bar's styled parts and every finite placement in CSS. */
export const actionBarContracts = [
  {
    family: 'action-bar',
    required: [
      ...['positioner', 'content', 'separator', 'selectionTrigger'].map(
        /** Identify one styled public part. */
        (part) => `.leverui-action-bar__${part}`,
      ),
      ...['bottom', 'bottom-start', 'bottom-end'].map(
        /** Identify a base placement. */
        (placement) => `[data-placement='${placement}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require a responsive placement at every supported breakpoint. */
        (breakpoint) => `[data-placement-${breakpoint}=`,
      ),
      "[data-state='open']",
      "[data-state='closed']",
      '--leverui-action-bar-offset',
    ],
  },
];
