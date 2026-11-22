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
        (part) => `.leverui-bar-list__${part}`,
      ),
      '.leverui-bar-list__row[data-hovered]',
      '--leverui-bar-list-size',
      '--leverui-private-bar-list-width',
      '--leverui-private-bar-list-color',
    ],
  },
];
