import { colorSwatchContentContract } from './authored-css-swatch-contract.mjs';
import { skeletonContentContract } from './authored-css-skeleton-contract.mjs';
import { separatorContentContract } from './authored-css-separator-contract.mjs';
import { proseContentContract } from './authored-css-prose-contract.mjs';

export const contentContracts = [
  colorSwatchContentContract,
  skeletonContentContract,
  separatorContentContract,
  proseContentContract,
  {
    family: 'em',
    required: ['.lui-em:not([data-unstyled])'],
  },
  {
    family: 'strong',
    required: ['.lui-strong:not([data-unstyled])', '--lui-font-weights-semibold'],
  },
  {
    family: 'quote',
    required: ['.lui-quote:not([data-unstyled])', '--lui-font-weights-bold', 'line-height: 1.2'],
  },
  {
    family: 'blockquote',
    required: [
      '.lui-blockquote__root:not([data-unstyled])',
      '.lui-blockquote__caption:not([data-unstyled])',
      '.lui-blockquote__icon:not([data-unstyled])',
      ...['subtle', 'solid', 'plain'].map(
        /** Require each finite Blockquote treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every responsive treatment selector. */
        (breakpoint) =>
          ['subtle', 'solid', 'plain'].map(
            /** Keep the variant manifest aligned with the CSS source. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      ...['start', 'center', 'end'].map(
        /** Require each scalar alignment. */
        (justify) => `[data-justify='${justify}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require all authored alignments at ordinary breakpoints. */
        (breakpoint) =>
          ['start', 'center', 'end'].map(
            /** Keep the manifest aligned with the responsive source. */
            (justify) => `[data-justify-${breakpoint}='${justify}']`,
          ),
      ),
      '--lui-colors-color-palette-muted',
      '--lui-colors-color-palette-solid',
      '--lui-colors-color-palette-fg',
    ],
  },
  {
    family: 'badge',
    required: [
      '.lui-badge:not([data-unstyled], [data-lui-private-style-runtime])',
      ...['xs', 'sm', 'md', 'lg'].map(
        /** Require each default Badge size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every ordinary breakpoint size choice. */
        (breakpoint) =>
          ['xs', 'sm', 'md', 'lg'].map(
            /** Keep responsive selectors aligned with the public size values. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      ...['solid', 'subtle', 'outline', 'surface', 'plain'].map(
        /** Require each public Badge variant. */
        (variant) => `[data-variant='${variant}']`,
      ),
      '--lui-colors-color-palette-solid',
      '--lui-colors-color-palette-fg',
    ],
  },
  {
    family: 'code',
    required: [
      '.lui-code:not([data-unstyled], [data-lui-private-style-runtime])',
      ':is(.lui-badge, .lui-code):not([data-unstyled], [data-lui-private-style-runtime])',
      ...['xs', 'sm', 'md', 'lg'].map(
        /** Require each Badge-derived Code size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every ordinary responsive Code size. */
        (breakpoint) =>
          ['xs', 'sm', 'md', 'lg'].map(
            /** Keep the shared selector manifest complete. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      ...['solid', 'subtle', 'outline', 'surface', 'plain'].map(
        /** Require every Badge-derived Code treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      '--lui-colors-color-palette-solid',
      '--lui-colors-color-palette-fg',
    ],
  },
  {
    family: 'mark',
    required: [
      '.lui-mark:not([data-unstyled], [data-lui-private-style-runtime])',
      ...['subtle', 'solid', 'text', 'plain'].map(
        /** Require each finite Mark treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each treatment at ordinary responsive breakpoints. */
        (breakpoint) =>
          ['subtle', 'solid', 'text', 'plain'].map(
            /** Keep the manifest aligned with authored Mark selectors. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      '--lui-colors-color-palette-solid',
      '--lui-colors-color-palette-contrast',
      '--lui-colors-color-palette-subtle',
    ],
  },
  {
    family: 'kbd',
    required: [
      '.lui-kbd:not([data-unstyled])',
      ...['sm', 'md', 'lg'].map(
        /** Require each finite Kbd size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each Kbd size at every supported breakpoint. */
        (breakpoint) =>
          ['sm', 'md', 'lg'].map(
            /** Keep the manifest aligned with responsive Kbd selectors. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      ...['raised', 'outline', 'subtle', 'plain'].map(
        /** Require each finite Kbd treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each Kbd treatment at every supported breakpoint. */
        (breakpoint) =>
          ['raised', 'outline', 'subtle', 'plain'].map(
            /** Keep the manifest aligned with responsive Kbd treatments. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      '--lui-colors-color-palette-subtle',
      '--lui-colors-color-palette-muted',
      '--lui-colors-color-palette-fg',
    ],
  },
  {
    family: 'link',
    required: [
      '.lui-link:not([data-unstyled])',
      '.lui-linkbox:not([data-unstyled])',
      '.lui-linkbox__overlay:not([data-unstyled])',
      ...['plain', 'underline'].map(
        /** Require both public Link treatments. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each Link treatment at ordinary breakpoints. */
        (breakpoint) =>
          ['plain', 'underline'].map(
            /** Keep responsive selectors aligned with public variants. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      ':focus-visible',
      'a[href]:not(.lui-linkbox__overlay)',
      '&::before',
      '--lui-colors-color-palette-fg',
      '--lui-colors-color-palette-focus-ring',
    ],
  },
];
