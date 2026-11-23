export const tabsContract = {
  family: 'tabs',
  required: [
    ...['root', 'list', 'trigger', 'content', 'indicator'].map(
      /** Require every styled Tabs part. */
      (part) => `.lui-tabs__${part}`,
    ),
    ...['sm', 'lg'].map(
      /** Require the nondefault Tabs sizes. */
      (size) => `[data-size='${size}']`,
    ),
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require every finite Tabs size at each supported breakpoint. */
      (breakpoint) =>
        ['sm', 'md', 'lg'].map(
          /** Keep the responsive size selector table complete. */
          (size) => `[data-size-${breakpoint}='${size}']`,
        ),
    ),
    ...['line', 'subtle', 'enclosed', 'plain', 'outline'].map(
      /** Require every authored Tabs variant. */
      (variant) => `[data-variant='${variant}']`,
    ),
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require every finite treatment at each supported breakpoint. */
      (breakpoint) =>
        ['line', 'subtle', 'enclosed', 'outline', 'plain'].map(
          /** Keep breakpoint reversal selectors in the stylesheet. */
          (variant) => `[data-variant-${breakpoint}='${variant}']`,
        ),
    ),
    "[data-orientation='vertical']",
    "[data-fitted='true']",
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require both responsive fitted states and each list alignment. */
      (breakpoint) => [
        `[data-fitted-${breakpoint}='true']`,
        `[data-fitted-${breakpoint}='false']`,
        ...['start', 'center', 'end'].map(
          /** Keep every authored alignment selector visible to the contract check. */
          (justify) => `[data-justify-${breakpoint}='${justify}']`,
        ),
      ],
    ),
  ],
};
