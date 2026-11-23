import { readFile } from 'node:fs/promises';

const styles = new URL('../src/styles/', import.meta.url);
const foundation = ['tokens-foundation.css', 'tokens-colors.css', 'tokens-sizes.css'];
const modes = { light: 'mode-light.css', dark: 'mode-dark.css' };
/** Each theme category and the prefix of its variables, such as `font-sizes`. */
export const categoryPrefixes = new Map([
  ['animations', 'animations'],
  ['aspectRatios', 'aspect-ratios'],
  ['blurs', 'blurs'],
  ['borders', 'borders'],
  ['breakpoints', 'breakpoints'],
  ['colors', 'colors'],
  ['cursor', 'cursor'],
  ['durations', 'durations'],
  ['easings', 'easings'],
  ['fonts', 'fonts'],
  ['fontSizes', 'font-sizes'],
  ['fontWeights', 'font-weights'],
  ['letterSpacings', 'letter-spacings'],
  ['lineHeights', 'line-heights'],
  ['radii', 'radii'],
  ['shadows', 'shadows'],
  ['sizes', 'sizes'],
  ['spacing', 'spacing'],
  ['zIndex', 'z-index'],
]);

/** Read authored CSS declarations, including values wrapped across lines. */
async function declarations(name, allowRepeats = false) {
  const css = await readFile(new URL(name, styles), 'utf8');
  const result = new Map();
  for (const match of css.matchAll(/^\s*(--lui-[^:\s]+):\s*([\s\S]*?);/gm)) {
    const [, variable, raw] = match;
    if (!allowRepeats && result.has(variable)) throw new Error(`${name} repeats ${variable}`);
    result.set(variable, raw.replace(/\s+/g, ' ').trim());
  }
  if (result.size === 0) throw new Error(`${name} has no Lever UI variables`);
  return result;
}

/** Map a public token variable to its original theme category. */
function categoryFor(variable) {
  for (const [category, prefix] of categoryPrefixes) {
    if (variable.startsWith(`--lui-${prefix}-`)) return category;
  }
  return undefined;
}

/** Index canonical CSS variables and mode values without a runtime system. */
export async function themeVariables() {
  const entries = new Map();
  for (const source of foundation) {
    for (const [variable, base] of await declarations(source)) {
      const category = categoryFor(variable);
      if (!category) throw new Error(`Unknown theme variable category: ${variable}`);
      if (entries.has(variable)) throw new Error(`Duplicate foundation variable: ${variable}`);
      entries.set(variable, { variable, category, source, base });
    }
  }
  for (const [mode, source] of Object.entries(modes)) {
    for (const [variable, value] of await declarations(source)) {
      const category = categoryFor(variable);
      if (!category) continue;
      const entry = entries.get(variable) ?? { variable, category, source };
      entry[mode] = value;
      entries.set(variable, entry);
    }
  }
  return new Map(
    [...entries].sort(
      /** Keep generated pages stable when source declarations move. */
      ([left], [right]) => left.localeCompare(right),
    ),
  );
}

/** List palette aliases actually declared by authored CSS. */
export async function paletteAliases() {
  const aliases = new Set();
  for (const source of ['palette-scales-01.css', 'palette-scales-02.css']) {
    for (const variable of (await declarations(source, true)).keys()) {
      if (variable.startsWith('--lui-colors-color-palette-')) aliases.add(variable);
    }
  }
  return [...aliases].sort();
}
