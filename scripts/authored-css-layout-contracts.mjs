import { imageLayoutContract } from './authored-css-image-contract.mjs';

export const layoutContracts = [
  { family: 'theme', required: ['.leverui-theme', '[data-leverui-no-background]'] },
  { family: 'box', required: ['.leverui-box'] },
  {
    family: 'absolute-center',
    required: [
      '.leverui-absolute-center:not([data-unstyled])',
      ...['horizontal', 'vertical', 'both'].map(
        /** Require every finite axis choice in authored CSS. */
        (axis) => `[data-axis='${axis}']`,
      ),
      "[dir='ltr']",
      "[dir='rtl']",
      '--lui-private-absolute-center-inline-translate',
    ],
  },
  {
    family: 'aspect-ratio',
    required: [
      '.leverui-aspect-ratio:not([data-unstyled])',
      '&::before',
      '& > *:not(style)',
      '& > :is(img, video)',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require native ratio values at every ordinary breakpoint. */
        (breakpoint) => `--lui-private-aspect-ratio-padding-${breakpoint}`,
      ),
    ],
  },
  {
    family: 'bleed',
    required: [
      '.leverui-bleed',
      ...['inline-start', 'inline-end', 'block-start', 'block-end'].flatMap(
        /** Require a native margin variable for each edge and breakpoint. */
        (edge) =>
          ['base', 'sm', 'md', 'lg', 'xl', '2xl'].map(
            /** Keep every logical Bleed edge responsive in authored CSS. */
            (breakpoint) => `--lui-private-bleed-${edge}-${breakpoint}`,
          ),
      ),
    ],
  },
  {
    family: 'center',
    required: [
      '.leverui-center',
      '--lui-center-align',
      '--lui-center-justify',
      "[data-inline='true']",
      '[data-unstyled]',
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both display choices at each responsive breakpoint. */
        (breakpoint) => [
          `[data-inline-${breakpoint}='true']`,
          `[data-inline-${breakpoint}='false']`,
        ],
      ),
    ],
  },
  {
    family: 'flex',
    required: [
      '.leverui-flex',
      "[data-inline='true']",
      ...['align', 'justify', 'wrap', 'direction', 'basis', 'grow', 'shrink'].flatMap(
        /** Require a CSS variable for each native alias and breakpoint. */
        (alias) =>
          ['base', 'sm', 'md', 'lg', 'xl', '2xl'].map(
            /** Keep the authored responsive Flex contract complete. */
            (breakpoint) => `--lui-private-flex-${alias}-${breakpoint}`,
          ),
      ),
    ],
  },
  {
    family: 'grid',
    required: [
      '.leverui-grid',
      "[data-inline='true']",
      ...[
        'template-columns',
        'auto-flow',
        'auto-rows',
        'auto-columns',
        'template-rows',
        'template-areas',
        'column',
        'row',
      ].flatMap(
        /** Require each Grid alias at every ordinary breakpoint. */
        (alias) =>
          ['base', 'sm', 'md', 'lg', 'xl', '2xl'].map(
            /** Keep the native Grid CSS variable contract complete. */
            (breakpoint) => `--lui-private-grid-${alias}-${breakpoint}`,
          ),
      ),
    ],
  },
  {
    family: 'grid-item',
    required: [
      '.leverui-grid-item',
      ...['area', 'column', 'row', 'column-start', 'column-end', 'row-start', 'row-end'].flatMap(
        /** Require every GridItem placement alias at each breakpoint. */
        (alias) =>
          ['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
            /** Keep each conditional selector and variable complete. */
            (breakpoint) => [
              `[data-grid-item-${alias}-${breakpoint}]`,
              `--lui-private-grid-item-${alias}-${breakpoint}`,
            ],
          ),
      ),
    ],
  },
  imageLayoutContract,
  {
    family: 'stack',
    required: [
      '.leverui-stack:not([data-unstyled])',
      '.leverui-stack-separator:not([data-unstyled])',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require layout and both separator axes at each breakpoint. */
        (breakpoint) => [
          `--lui-private-stack-gap-${breakpoint}`,
          `--lui-private-stack-render-gap-${breakpoint}`,
          `[data-direction-${breakpoint}='column']`,
          `[data-direction-${breakpoint}='row']`,
        ],
      ),
    ],
  },
  {
    family: 'spacer',
    required: [
      '.leverui-spacer:not([data-unstyled])',
      '--lui-spacer-flex',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each responsive native flex selection. */
        (breakpoint) => [
          `[data-spacer-flex-${breakpoint}]`,
          `--lui-private-spacer-flex-${breakpoint}`,
        ],
      ),
    ],
  },
  {
    family: 'sticky',
    required: ['.leverui-sticky:not([data-unstyled])', 'position: sticky', '--lui-sticky-top'],
  },
  {
    family: 'wrap',
    required: [
      '.leverui-wrap:not([data-unstyled])',
      '--lui-wrap-gap',
      ...['align', 'justify', 'direction', 'gap', 'row-gap', 'column-gap'].flatMap(
        /** Require every Wrap alias at every ordinary breakpoint. */
        (alias) =>
          ['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
            /** Keep selector and variable coverage together. */
            (breakpoint) => [
              `[data-wrap-${alias}-${breakpoint}]`,
              `--lui-private-wrap-${alias}-${breakpoint}`,
            ],
          ),
      ),
      '.leverui-wrap__listitem:not([data-unstyled])',
      '--lui-wrap-item-align',
    ],
  },
  {
    family: 'container',
    required: [
      '.leverui-container:not([data-unstyled])',
      '--lui-container-max-width',
      '--lui-container-padding',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both variant values at each supported breakpoint. */
        (breakpoint) => [
          `[data-center-content-${breakpoint}='true']`,
          `[data-fluid-${breakpoint}='true']`,
          ...(breakpoint === 'base'
            ? []
            : [
                `[data-center-content-${breakpoint}='false']`,
                `[data-fluid-${breakpoint}='false']`,
              ]),
        ],
      ),
    ],
  },
];
