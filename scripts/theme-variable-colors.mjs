/** The color page's sections: neutral roles, each palette, and the palette aliases. */
import { code, natural, sorter, suffix } from './theme-variable-format.mjs';

const palettes = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
];
const roles = ['contrast', 'fg', 'subtle', 'muted', 'emphasized', 'solid', 'focus-ring', 'border'];

/** Sort one palette: shades from light to dark, then its roles in a fixed order. */
function paletteOrder(palette) {
  /** Rank a color by its shade number, or by its role after every shade. */
  function rank(entry) {
    const name = suffix(entry, 'colors').slice(palette.length + 1);
    const role = roles.indexOf(name);
    return /^\d+$/.test(name) ? Number(name) : 10_000 + (role === -1 ? roles.length : role);
  }
  return (
    /** Compare two colors of this palette by rank. */
    (left, right) => rank(left) - rank(right)
  );
}

/** Split the color variables into the sections a reader looks for. */
export function colorSections(entries) {
  const taken = new Set();
  /** Claim the entries that match, so each lands in one section only. */
  function claim(test, order) {
    const found = entries.filter(
      /** Keep an unclaimed color whose name matches. */
      (entry) => !taken.has(entry) && test(suffix(entry, 'colors')),
    );
    for (const entry of found) taken.add(entry);
    return found.sort(order ?? natural('colors'));
  }
  const sections = [
    ...[
      ['Background', 'bg'],
      ['Text', 'fg'],
      ['Border', 'border'],
    ].map(
      /** Collect one neutral role and its variants, such as `bg-muted`. */
      ([heading, role]) => [
        heading,
        claim(
          /** Match the role and its variants. */
          (name) => name === role || name.startsWith(`${role}-`),
        ),
      ],
    ),
    ...palettes.map(
      /** Collect one palette's shades and roles under its name. */
      (palette) => [
        palette.charAt(0).toUpperCase() + palette.slice(1),
        claim(
          /** Match this palette's colors. */
          (name) => name.startsWith(`${palette}-`),
          paletteOrder(palette),
        ),
      ],
    ),
    [
      'Black and white',
      claim(
        /** Match black, white, and their see-through steps. */
        (name) => /^(black|white)(-|$)/.test(name),
      ),
    ],
  ];
  sections.push([
    'Other',
    claim(
      /** Take whatever is left. */
      () => true,
    ),
  ]);
  return sections.filter(
    /** Drop a section with nothing in it. */
    ([, list]) => list.length > 0,
  );
}

/** Explain the palette aliases that `colorPalette` points at the chosen palette. */
export function aliasSection(aliases) {
  /** The alias name after its prefix, such as `500` or `solid`. */
  function name(variable) {
    return variable.replace('--lui-colors-color-palette-', '');
  }
  const ordered = [...aliases].sort(
    /** Put shades first, lightest to darkest, then the roles. */
    (left, right) =>
      Number(/^\d+$/.test(name(right))) - Number(/^\d+$/.test(name(left))) ||
      sorter.compare(name(left), name(right)),
  );
  const rows = ordered.map(
    /** Describe one alias in a table row. */
    (variable) => {
      const part = name(variable);
      const meaning = /^\d+$/.test(part) ? `Shade ${part}` : `The ${code(part)} role`;
      return `| ${code(variable)} | ${meaning} of the current palette. |`;
    },
  );
  return [
    '## Palette aliases',
    '',
    'These point at whichever palette is in use. Set the palette with',
    '`colorPalette` on a component, or `data-lui-color-palette` on any',
    'element. Gray is the default.',
    '',
    '| Variable | Means |',
    '| --- | --- |',
    ...rows,
  ].join('\n');
}
