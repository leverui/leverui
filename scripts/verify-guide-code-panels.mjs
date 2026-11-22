import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readGuidePanels } from './guide-code-panel-reader.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const slugs = process.argv.slice(2);
const providedPackages = new Set(['@leverui/components', 'solid-js']);
/** The app-entry import that loads the package styles once; examples do not repeat it. */
const packageStylesheetImport = "import '@leverui/components/styles.css';";

/** List the third-party packages that the copied examples import. */
function importedPackages(panels) {
  const source = panels
    .flat(2)
    .map(
      /** Read one displayed file's source text. */
      (file) => file.source,
    )
    .join('\n');
  const names = [...source.matchAll(/(?:from |import\(|import )'([^.'][^']*)'/g)].map(
    /** Reduce an import specifier to its package name, keeping a scope when present. */
    (match) =>
      match[1]
        .split('/')
        .slice(0, match[1].startsWith('@') ? 2 : 1)
        .join('/'),
  );
  return [...new Set(names)].filter(
    /** Keep packages that the consumer project does not already provide. */
    (name) => !providedPackages.has(name),
  );
}

/** Find the component a copied example exports for mounting. */
function exportedComponent(source, location) {
  const match = source.match(/export (?:default )?function (\w+)/);
  assert.ok(match, `${location} must export a component.`);
  return match[1];
}

/** Write one example's displayed source and return how the entry should mount it. */
async function writePanel(directory, slug, index, files) {
  const folder = `guide/${slug}/${index}`;
  const [example] = files;
  assert.ok(example, `${slug} ${index} has no code.`);
  await mkdir(join(directory, 'src', folder), { recursive: true });
  await writeFile(join(directory, 'src', folder, 'example.tsx'), `${example.source}\n`);
  const name = exportedComponent(example.source, `${slug} ${index}`);
  return { id: `${slug}-${index}`, folder, name, file: 'example.tsx' };
}

/** Copy complete programs from the guide so they are compiled but not mounted. */
async function writeGuideFences(directory, slug) {
  const guide = await readFile(join(projectDirectory, `docs/components/${slug}.md`), 'utf8');
  const fences = [...guide.matchAll(/```tsx\n([\s\S]*?)\n```/g)].filter(
    /** Keep fences that are whole modules rather than fragments. */
    (match) => /^export function/m.test(match[1]) && /^import /m.test(match[1]),
  );
  for (const [index, match] of fences.entries()) {
    const folder = join(directory, 'src/guide', slug, `fence-${index}`);
    await mkdir(folder, { recursive: true });
    await writeFile(join(folder, 'example.tsx'), `${match[1]}\n`);
  }
}

/** Build the app entry: import the package stylesheet once, then mount each example. */
function consumerEntry(mounts) {
  const imports = mounts.map(
    /** Alias each copied component to a unique local name. */
    (mount, index) =>
      `import { ${mount.name} as Example${index} } from './${mount.folder}/${mount.file.replace(/\.tsx?$/, '')}';`,
  );
  const sections = mounts.map(
    /** Give each example a selector the browser check can target. */
    (mount, index) => `<section data-guide="${mount.id}"><Example${index} /></section>`,
  );
  return `${packageStylesheetImport}
import { render } from '@solidjs/web';
${imports.join('\n')}

/** Render each copied example in a standalone Solid app. */
function GuideExamples() {
  return <main>${sections.join('')}</main>;
}

const target = document.getElementById('app');
if (!target) throw new Error('Missing guide consumer mount point.');
render(GuideExamples, target);
`;
}

/** Add any extra packages the examples import. */
async function configureConsumer(directory, mounts) {
  await writeFile(
    join(directory, 'vite.config.ts'),
    "import { defineConfig } from 'vite';\nimport solid from '@solidjs/vite-plugin';\nexport default defineConfig({ plugins: [solid()] });\n",
  );
  await writeFile(
    join(directory, 'tsconfig.guide.json'),
    JSON.stringify({ extends: './tsconfig.json', include: ['src/guide/**/*.tsx'], exclude: [] }),
  );
  await writeFile(join(directory, 'src/main.tsx'), consumerEntry(mounts));
}

/** Confirm every copied example mounted content without a runtime failure. */
async function verifyConsumer(page, mounts) {
  const errors = [];
  page.on(
    'pageerror',
    /** Keep runtime failures for the final assertion. */
    (error) => errors.push(error.message),
  );
  await page.locator('[data-guide]').first().waitFor();
  await page.waitForTimeout(800);
  assert.equal(await page.locator('[data-guide]').count(), mounts.length);
  const empty = await page.locator('[data-guide]').evaluateAll(
    /** List sections that rendered nothing. */
    (sections) =>
      sections
        .filter((section) => !section.childElementCount)
        .map((section) => section.dataset.guide),
  );
  assert.deepEqual(empty, []);
  assert.deepEqual(errors, []);
}

/** Pack the public package and verify the guides' displayed code outside the repo. */
async function main() {
  assert.ok(slugs.length, 'Pass at least one component guide slug.');
  const directory = await mkdtemp(join(tmpdir(), 'leverui-guide-panels-'));
  try {
    const guides = [];
    for (const slug of slugs) guides.push({ slug, panels: await readGuidePanels(slug) });
    await prepareConsumer(directory, {
      ignoreScripts: true,
      tools: [
        'typescript',
        'vite',
        '@solidjs/vite-plugin',
        ...importedPackages(guides.map((guide) => guide.panels)),
      ],
    });
    const mounts = [];
    for (const { slug, panels } of guides) {
      for (const [index, files] of panels.entries()) {
        mounts.push(await writePanel(directory, slug, index, files));
      }
      await writeGuideFences(directory, slug);
    }
    await configureConsumer(directory, mounts);
    await installConsumer(directory, { offline: true });
    runTypecheck(['--noEmit', '-p', 'tsconfig.guide.json'], directory);
    run('pnpm', ['exec', 'vite', 'build'], directory);
    await withPackedPreview(
      directory,
      '/',
      /** Run the shared mount check against the production build. */
      (page) => verifyConsumer(page, mounts),
    );
    console.log(`${mounts.length} copied guide examples passed for: ${slugs.join(', ')}.`);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

await main();
