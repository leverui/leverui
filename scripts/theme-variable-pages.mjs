/** The Markdown for the generated CSS variable pages: one page per category. */
import { aliasSection, colorSections } from './theme-variable-colors.mjs';
import { code, natural } from './theme-variable-format.mjs';

/** Marks a page as generated, so a later run may replace or remove it. */
export const generatedMarker =
  '<!-- Generated from Lever UI CSS by `pnpm generate:theme-reference`. Do not edit. -->';

/** Render one table, with a Dark column only when a value changes in dark mode. */
function table(entries) {
  const withDark = entries.some(
    /** Find a value that differs in dark mode. */
    (entry) => entry.dark,
  );
  const lines = withDark
    ? ['| Variable | Light | Dark |', '| --- | --- | --- |']
    : ['| Variable | Value |', '| --- | --- |'];
  for (const entry of entries) {
    const value = code(entry.light ?? entry.base);
    lines.push(
      withDark
        ? `| ${code(entry.variable)} | ${value} | ${entry.dark ? code(entry.dark) : 'Same'} |`
        : `| ${code(entry.variable)} | ${value} |`,
    );
  }
  return lines.join('\n');
}

/** Render one category's page. */
export function renderCategory({ title, prefix, entries, aliases }) {
  const lines = [`# ${title}`, '', generatedMarker, '', `[All variables](README.md)`, ''];
  if (prefix === 'colors') {
    lines.push(
      'A shade, such as `blue-500`, is the same in light and dark mode. A role,',
      'such as `blue-subtle`, changes with the mode. See every color as a swatch',
      'on the [Colors](../colors.md) page.',
      '',
    );
    for (const [heading, list] of colorSections(entries)) {
      lines.push(`## ${heading}`, '', table(list), '');
    }
    lines.push(aliasSection(aliases), '');
  } else {
    lines.push(table([...entries].sort(natural(prefix))), '');
  }
  return lines.join('\n');
}

/** Render the index: one row per category, with how many variables it holds. */
export function renderIndex(pages) {
  return [
    '# Lever UI CSS variables',
    '',
    generatedMarker,
    '',
    'Every CSS variable in the default stylesheet. To change one, set it in your',
    'own CSS, loaded after `@leverui/components/styles.css`. See',
    '[Customize with CSS](../theming.md).',
    '',
    '| Category | Variables |',
    '| --- | --- |',
    ...pages.map(
      /** Link one category's page. */
      (page) => `| [${page.label}](${page.file}) | ${page.count} |`,
    ),
    '',
  ].join('\n');
}
