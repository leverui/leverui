/** Require every public Bar List part and interaction state in authored CSS. */
export const barListContracts = [
  {
    family: 'bar-list',
    required: [
      ...[
        'root',
        'content',
        'title',
        'labelHeading',
        'bar',
        'row',
        'fill',
        'rowLabel',
        'value',
        'valueRow',
        'tooltip',
      ].map(
        /** Keep one stable selector for each styled Bar List part. */
        (part) => `.lui-bar-list__${part}`,
      ),
      '.lui-bar-list__row[data-hovered]',
      '--lui-bar-list-size',
      '--lui-private-bar-list-width',
      '--lui-private-bar-list-color',
    ],
  },
];
