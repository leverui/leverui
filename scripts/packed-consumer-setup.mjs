import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const fixtureDirectory = join(projectDirectory, 'tests/packed-consumer');

/** Run one isolated consumer command and preserve diagnostics on failure. */
export function run(command, args, directory, env = process.env) {
  const result = spawnSync(command, args, {
    cwd: directory,
    env,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.trim();
}

/** Check consumer source types with a bounded 1.5 GiB compiler heap. */
export function runTypecheck(args, directory) {
  run('pnpm', ['exec', 'tsc', ...args], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1536',
  });
}

/** Pin the isolated app's tools to versions installed by this project. */
async function installedVersion(name) {
  const path = join(projectDirectory, 'node_modules', name, 'package.json');
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  assert.equal(typeof manifest.version, 'string');
  return manifest.version;
}

/** Match a nested tool dependency to the version already installed for this checkout. */
async function installedToolDependencyVersion(parentName, dependencyName) {
  const parentDirectory = await realpath(join(projectDirectory, 'node_modules', parentName));
  const path = join(parentDirectory, '..', dependencyName, 'package.json');
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  assert.equal(typeof manifest.version, 'string');
  return manifest.version;
}

/** Copy fixture files and create a package manifest for an isolated app. */
export async function prepareConsumer(
  directory,
  {
    ignoreScripts = false,
    tools = [
      '@internationalized/date',
      'jsdom',
      'shiki',
      'typescript',
      'vite',
      '@solidjs/vite-plugin',
    ],
  } = {},
) {
  const packArgs = ['pack', '--pack-destination', directory];
  if (ignoreScripts) packArgs.push('--ignore-scripts');
  run(ignoreScripts ? 'npm' : 'pnpm', packArgs, projectDirectory, {
    ...process.env,
    npm_config_cache: join(directory, '.npm-cache'),
  });
  const archive = (await readdir(directory)).find(
    /** Find the one archive emitted by pnpm pack. */ (name) => name.endsWith('.tgz'),
  );
  assert.ok(archive, 'pnpm pack produced no archive.');
  const contents = run('tar', ['-tzf', join(directory, archive)], projectDirectory);
  assert.doesNotMatch(contents, /(?:^|\/)(?:src|tests)\//m);

  for (const name of await readdir(fixtureDirectory)) {
    await cp(join(fixtureDirectory, name), join(directory, name), { recursive: true });
  }

  const manifest = {
    name: 'leverui-packed-consumer',
    private: true,
    type: 'module',
    dependencies: {
      '@leverui/components': `file:./${archive}`,
      'solid-js': await installedVersion('solid-js'),
      '@solidjs/web': await installedVersion('@solidjs/web'),
    },
    devDependencies: Object.fromEntries(
      await Promise.all(
        tools.map(
          /** Match each requested tool to the installed project version. */
          async (name) => [name, await installedVersion(name)],
        ),
      ),
    ),
    pnpm: {
      overrides: {
        '@shikijs/vscode-textmate': await installedToolDependencyVersion(
          'shiki',
          '@shikijs/vscode-textmate',
        ),
      },
    },
  };
  await writeFile(join(directory, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Install the archive and prove it resolves inside the isolated app. */
export async function installConsumer(directory, { offline = false } = {}) {
  const store = run('pnpm', ['store', 'path'], projectDirectory);
  run(
    'pnpm',
    [
      'install',
      '--ignore-scripts',
      offline ? '--offline' : '--prefer-offline',
      '--store-dir',
      store,
    ],
    directory,
  );
  const installed = await realpath(join(directory, 'node_modules/@leverui/components'));
  const isolated = await realpath(directory);
  assert.ok(installed.startsWith(`${isolated}${sep}`), 'The package is not installed in the app.');
}
