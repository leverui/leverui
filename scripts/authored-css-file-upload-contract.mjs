/** Require authored selectors for every styled File Upload surface. */
export const fileUploadContracts = [
  {
    family: 'file-upload',
    required: [
      '.lui-file-upload__root:not([data-unstyled])',
      ...[
        'label',
        'dropzone',
        'dropzoneContent',
        'itemGroup',
        'item',
        'itemContent',
        'itemName',
        'itemSizeText',
        'itemDeleteTrigger',
        'itemPreview',
      ].map(
        /** Keep every styled public part in the bundled stylesheet. */
        (slot) => `.lui-file-upload__${slot}:not([data-unstyled])`,
      ),
      '[data-dragging]',
      ':focus-visible',
    ],
  },
];
