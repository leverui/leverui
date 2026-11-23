import { buttonContract } from './authored-css-button-contract.mjs';
import { cardContract } from './authored-css-card-contract.mjs';
import { tabsContract } from './authored-css-tabs-contract.mjs';

export const coreContracts = [
  {
    family: 'skip-nav',
    required: ['.lui-skip-nav:not([data-unstyled])', ':focus-visible', '.lui-skip-nav-content'],
  },
  {
    family: 'visually-hidden',
    required: ['.lui-visually-hidden:not([data-unstyled])', 'clip: rect(0 0 0 0)'],
  },
  {
    family: 'command-dialog',
    files: ['command-dialog.css', 'visually-hidden.css'],
    required: ['.lui-command-dialog__content', '.lui-command-dialog__accessible-label'],
  },
  {
    family: 'heading',
    required: [
      '.lui-heading:not([data-unstyled])',
      ...['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].map(
        /** Require every finite Heading size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every finite Heading choice at each responsive breakpoint. */
        (breakpoint) =>
          ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].map(
            /** Keep the selector manifest aligned with authored CSS. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
    ],
  },
  {
    family: 'text',
    required: [
      '.lui-text',
      '[data-truncate]',
      "[data-line-clamp='value']",
      "[data-line-clamp='none']",
      '--lui-private-text-line-clamp',
    ],
  },
  {
    family: 'textarea',
    required: [
      '.lui-textarea',
      ...['xs', 'sm', 'lg', 'xl'].map(
        /** Require each nondefault authored Textarea size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['outline', 'subtle', 'flushed'].map(
        /** Require every authored Textarea treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require one complete responsive selector family per breakpoint. */
        (breakpoint) => [
          `[data-size-${breakpoint}='xs']`,
          `[data-size-${breakpoint}='xl']`,
          `[data-variant-${breakpoint}='outline']`,
          `[data-variant-${breakpoint}='flushed']`,
        ],
      ),
      '[data-autoresize]',
      '--lui-private-textarea-font-size',
      '--lui-private-textarea-focus-color',
    ],
  },
  {
    family: 'spinner',
    required: [
      '.lui-spinner:not([data-unstyled])',
      ...['inherit', 'xs', 'sm', 'md', 'lg', 'xl'].map(
        /** Require every finite Spinner size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require an authored responsive size selector at each breakpoint. */
        (breakpoint) => `[data-size-${breakpoint}='xl']`,
      ),
      '--lui-spinner-track-color',
      'animation: var(--lui-animations-spin)',
      'border-bottom-color:',
    ],
  },
  {
    family: 'loader',
    required: [
      '.lui-loader:not([data-unstyled])',
      '.lui-loader__indicator',
      '.lui-loader__content',
      '.lui-loader-overlay:not([data-unstyled])',
    ],
  },
  buttonContract,
  cardContract,
  {
    family: 'icon-button',
    required: [
      '.lui-button.lui-icon-button:not(',
      'padding-inline: 0',
      'padding-block: 0',
      'font-size: 1.2em',
    ],
  },
  {
    family: 'switch',
    required: [
      ...['root', 'control', 'thumb', 'indicator', 'label'].map(
        /** Require every styled Switch part. */
        (part) => `.lui-switch__${part}`,
      ),
      ...['xs', 'sm', 'lg'].map(
        /** Require the nondefault Switch sizes. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every authored Switch size at each responsive breakpoint. */
        (breakpoint) =>
          ['xs', 'sm', 'md', 'lg'].map(
            /** Keep the finite selector matrix complete in the CSS bundle. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      "[data-variant='raised']",
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both Switch variants at each responsive breakpoint. */
        (breakpoint) =>
          ['solid', 'raised'].map(
            /** Keep responsive variant selectors complete in the CSS bundle. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      "[data-state='checked']",
    ],
  },
  tabsContract,
  {
    family: 'dialog',
    required: [
      ...[
        'backdrop',
        'positioner',
        'content',
        'header',
        'body',
        'footer',
        'title',
        'description',
        'closeTrigger',
      ].map(
        /** Require every Dialog part with authored presentation. */
        (part) => `.lui-dialog__${part}`,
      ),
      ...['xs', 'sm', 'md', 'lg', 'xl', 'cover', 'full'].map(
        /** Require every finite Dialog size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['center', 'top', 'bottom'].map(
        /** Require every Dialog placement. */
        (placement) => `[data-placement='${placement}']`,
      ),
      ...['inside', 'outside'].map(
        /** Require both Dialog scroll modes. */
        (mode) => `[data-scroll-behavior='${mode}']`,
      ),
      ...['scale', 'slide-in-bottom', 'slide-in-top', 'slide-in-left', 'slide-in-right'].map(
        /** Require each motion preset with an authored rule. */
        (motion) => `[data-motion-preset='${motion}']`,
      ),
    ],
  },
];
