import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const libRoot = join(projectRoot, 'website/src/lib');
const examplesRoot = join(libRoot, 'guide-examples');
const categoryFiles = readdirSync(examplesRoot)
  .filter(
    /** Keep the per-category data files, not the merged index or shared types. */
    (file) => file.endsWith('.ts') && file !== 'index.ts' && file !== 'types.ts',
  )
  .sort();

/**
 * Bundle the website's extensionless TypeScript modules in memory and load them,
 * because Node cannot resolve Vite-style relative imports on its own.
 */
async function loadWebsiteModules() {
  const categoryNames = categoryFiles.map(
    /** Name each category namespace by its file position. */
    (_, index) => `category${index}`,
  );
  const categoryImports = categoryFiles.map(
    /** Import one category file under its namespace name. */
    (file, index) =>
      `import * as ${categoryNames[index]} from ${JSON.stringify(join(examplesRoot, file))};`,
  );
  const entry = [
    ...categoryImports,
    `export { guideExamples } from ${JSON.stringify(examplesRoot)};`,
    `export { guideStoryFilename } from ${JSON.stringify(join(libRoot, 'guide-story-aliases'))};`,
    `export { orderGuideStories } from ${JSON.stringify(join(libRoot, 'guide-story-order'))};`,
    `export { guideStoryName } from ${JSON.stringify(join(libRoot, 'guide-story-name'))};`,
    `export const categories = [${categoryNames.join(', ')}];`,
  ].join('\n');
  const result = await build({
    stdin: { contents: entry, resolveDir: libRoot, loader: 'ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0]?.text ?? '';
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const website = await loadWebsiteModules();

/** Find the demo family the site loads for a guide, mirroring `loadGuideStories`. */
function storyFileForGuide(slug) {
  const file = join(projectRoot, 'demos', `${website.guideStoryFilename(slug)}.tsx`);
  return existsSync(file) ? file : undefined;
}

/** List the story exports the site renders, using the same pattern as `loadGuideStories`. */
function storyExports(file) {
  const source = readFileSync(file, 'utf8');
  return new Set(
    [...source.matchAll(/export const ([A-Za-z_]\w*): Story\b/g)].map(
      /** Keep the export name from each typed story declaration. */
      (match) => match[1],
    ),
  );
}

/** Every listed id must name a story the guide actually loads. */
function verifyIdsResolveToStories() {
  const missing = [];
  for (const [slug, entries] of Object.entries(website.guideExamples)) {
    const file = storyFileForGuide(slug);
    if (!file) {
      missing.push(`${slug}: no Storybook file`);
      continue;
    }
    const exports = storyExports(file);
    for (const entry of entries) {
      if (!exports.has(entry.id)) missing.push(`${slug}: ${entry.id}`);
    }
  }
  assert.deepEqual(missing, []);
}

/** A repeated id would make its order, title, or omission ambiguous. */
function verifyIdsAreUnique() {
  const repeated = [];
  for (const [slug, entries] of Object.entries(website.guideExamples)) {
    const seen = new Set();
    for (const entry of entries) {
      if (seen.has(entry.id)) repeated.push(`${slug}: ${entry.id}`);
      seen.add(entry.id);
    }
  }
  assert.deepEqual(repeated, []);
}

/** A slug listed in two category files would silently override the other entry. */
function verifyEachGuideHasOneCategoryFile() {
  const slugs = website.categories.flatMap(
    /** Collect every slug defined by one category module. */
    (module) => Object.values(module).flatMap(Object.keys),
  );
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(Object.keys(website.guideExamples).length, slugs.length);
}

/** Listed stories follow the map, unlisted ones follow them, and omitted ones disappear. */
function verifyOrderTitlesAndOmissions() {
  const ids = ['Alert', 'Unlisted', 'Form', 'Basic'];
  const stories = ids.map(
    /** Build the minimal story shape the ordering reads. */
    (id) => ({ id, name: id }),
  );
  const ordered = website.orderGuideStories('overlay-manager', stories).map(
    /** Compare stories by export name. */
    (story) => story.id,
  );
  assert.deepEqual(ordered, ['Basic', 'Form', 'Unlisted']);
  assert.equal(website.guideStoryName('overlay-manager', 'Basic', 'Basic'), 'Dialog');
  assert.equal(website.guideStoryName('overlay-manager', 'Unlisted', 'Fallback'), 'Fallback');
}

test('every guide example id resolves to a rendered Storybook export', verifyIdsResolveToStories);
test('guide example ids are unique within each guide', verifyIdsAreUnique);
test('each guide is listed in exactly one category file', verifyEachGuideHasOneCategoryFile);
test('guide examples drive order, titles, and omissions', verifyOrderTitlesAndOmissions);
