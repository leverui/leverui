import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import prettier from 'prettier';
import { categoryPrefixes, paletteAliases, themeVariables } from './theme-variable-source.mjs';
import { generatedMarker, renderCategory, renderIndex } from './theme-variable-pages.mjs';

const outputDirectory = new URL('../docs/theme-variables/', import.meta.url);
const check = process.argv.includes('--check');
const expectedPages = new Set();

/** Each category's page name, title, and index label. */
const categoryPages = {
  animations: ['animations', 'Animation variables', 'Animations'],
  aspectRatios: ['aspect-ratios', 'Aspect ratio variables', 'Aspect ratios'],
  blurs: ['blurs', 'Blur variables', 'Blurs'],
  borders: ['borders', 'Border variables', 'Borders'],
  breakpoints: ['breakpoints', 'Breakpoint variables', 'Breakpoints'],
  colors: ['colors', 'Color variables', 'Colors'],
  cursor: ['cursor', 'Cursor variables', 'Cursors'],
  durations: ['durations', 'Duration variables', 'Durations'],
  easings: ['easings', 'Easing variables', 'Easings'],
  fonts: ['fonts', 'Font variables', 'Fonts'],
  fontSizes: ['font-sizes', 'Font size variables', 'Font sizes'],
  fontWeights: ['font-weights', 'Font weight variables', 'Font weights'],
  letterSpacings: ['letter-spacings', 'Letter spacing variables', 'Letter spacings'],
  lineHeights: ['line-heights', 'Line height variables', 'Line heights'],
  radii: ['radii', 'Radius variables', 'Radii'],
  shadows: ['shadows', 'Shadow variables', 'Shadows'],
  sizes: ['sizes', 'Size variables', 'Sizes'],
  spacing: ['spacing', 'Spacing variables', 'Spacing'],
  zIndex: ['z-index', 'Z-index variables', 'Z-index'],
};

/** Sort authored variable declarations into documented theme categories. */
function byCategory(variables) {
  const groups = new Map();
  for (const entry of variables.values()) {
    const group = groups.get(entry.category) ?? [];
    group.push(entry);
    groups.set(entry.category, group);
  }
  return groups;
}

/** Write a generated page or fail when checked-in output has drifted. */
async function outputPage(name, content) {
  expectedPages.add(name);
  const file = new URL(name, outputDirectory);
  const formatted = await prettier.format(content, { filepath: file.pathname });
  if (check) {
    const existing = await readFile(file, 'utf8');
    assert.equal(existing, formatted, `${name} is stale; run pnpm generate:theme-reference`);
    return;
  }
  await writeFile(file, formatted);
}

/** Reject or remove generated pages absent from the current stylesheet. */
async function reconcilePages() {
  const obsolete = (await readdir(outputDirectory)).filter(
    /** Identify a Markdown page absent from this generation. */
    (name) => name.endsWith('.md') && !expectedPages.has(name),
  );
  if (check) {
    assert.deepEqual(obsolete, [], `Obsolete theme pages: ${obsolete.join(', ')}`);
    return;
  }
  for (const name of obsolete) {
    const file = new URL(name, outputDirectory);
    const content = await readFile(file, 'utf8');
    assert.ok(
      content.includes(generatedMarker) || /Generated from Lever UI/.test(content),
      `${name} is not generated`,
    );
    await unlink(file);
  }
}

/** Generate one page per category and an index from canonical authored CSS. */
async function generateReference() {
  if (!check) await mkdir(outputDirectory, { recursive: true });
  const aliases = await paletteAliases();
  const pages = [];
  for (const [category, entries] of byCategory(await themeVariables())) {
    const page = categoryPages[category];
    assert.ok(page, `No page is named for the ${category} category`);
    const [slug, title, label] = page;
    const prefix = categoryPrefixes.get(category);
    await outputPage(`${slug}.md`, renderCategory({ title, prefix, entries, aliases }));
    pages.push({ file: `${slug}.md`, label, count: entries.length });
  }
  pages.sort(
    /** List the categories alphabetically. */
    (left, right) => left.label.localeCompare(right.label),
  );
  await outputPage('README.md', renderIndex(pages));
  await reconcilePages();
}

await generateReference();
console.log(check ? 'Theme variable reference is current.' : 'Generated theme variable reference.');
