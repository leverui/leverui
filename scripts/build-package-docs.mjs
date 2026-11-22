import assert from 'node:assert/strict';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatLlmsIndex } from './llms-index.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = join(projectRoot, 'docs');
const outputRoot = join(projectRoot, 'dist/docs');
const packagePath = 'node_modules/@leverui/components/dist/docs';

/** Guides for people working on Lever UI itself, which users of the package do not need. */
const maintainerGuides = new Set([
  'README.md',
  'browser-testing.md',
  'naming.md',
  'releasing.md',
  'tooling.md',
  'website.md',
]);
const partPattern = /\.part-(\d+)\.md$/;

/** The sections of the index, in order, with the folder each one reads. */
const sections = [
  { title: 'Guides', folder: '' },
  { title: 'Concepts', folder: 'concepts' },
  { title: 'Components', folder: 'components' },
  { title: 'Theme variables', folder: 'theme-variables' },
];

/** List a folder's pages, joining each `name.part-N.md` continuation after its page. */
async function readPages(folder) {
  const names = (await readdir(join(sourceRoot, folder)))
    .filter(
      /** Keep the Markdown pages users need. */
      (name) => name.endsWith('.md') && !(folder === '' && maintainerGuides.has(name)),
    )
    .sort();
  const pages = new Map();
  for (const name of names) {
    const page = name.replace(partPattern, '.md');
    const part = Number(partPattern.exec(name)?.[1] ?? 1);
    const content = await readFile(join(sourceRoot, folder, name), 'utf8');
    pages.set(page, [...(pages.get(page) ?? []), { part, content }]);
  }
  return [...pages].map(
    /** Join one page's parts in number order. */
    ([name, parts]) => ({
      path: posix.join(folder, name),
      content: parts
        .sort(
          /** Order parts numerically. */
          (first, second) => first.part - second.part,
        )
        .map(
          /** Keep each part's text. */
          (part) => part.content.trimEnd(),
        )
        .join('\n\n')
        .concat('\n'),
    }),
  );
}

/** Fail when a page links to a local file that the package does not include. */
function checkLinks(pages) {
  const paths = new Set(
    pages.map(
      /** Read a page's path. */
      (page) => page.path,
    ),
  );
  for (const page of pages) {
    for (const match of page.content.matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = match[1].split('#')[0];
      if (!href || /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('/')) continue;
      const target = posix.normalize(posix.join(posix.dirname(page.path), href));
      assert.ok(paths.has(target), `${page.path} links to ${target}, which is not in the package.`);
    }
  }
}

/** Copy the user guides into `dist/docs` and write `dist/docs/llms.txt`. */
async function main() {
  const sectionPages = [];
  for (const section of sections) {
    sectionPages.push({ title: section.title, pages: await readPages(section.folder) });
  }
  const pages = sectionPages.flatMap(
    /** Read a section's pages. */
    (section) => section.pages,
  );
  checkLinks(pages);
  await rm(outputRoot, { recursive: true, force: true });
  for (const page of pages) {
    const target = join(outputRoot, page.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, page.content);
  }
  const introduction = `These guides match the installed version of \`@leverui/components\`. Paths are relative to this file, in \`${packagePath}\`. Read the guide for a component before using it, and use only the props, parts, and CSS variables it documents.`;
  const index = formatLlmsIndex(
    introduction,
    sectionPages.map(
      /** List a section's guides by their paths in the package. */
      (section) => ({
        title: section.title,
        guides: section.pages.map(
          /** Link a guide by its path. */
          (page) => ({ content: page.content, href: page.path }),
        ),
      }),
    ),
  );
  await writeFile(join(outputRoot, 'llms.txt'), index);
  console.log(`Package docs written: ${pages.length} guides and llms.txt.`);
}

await main();
