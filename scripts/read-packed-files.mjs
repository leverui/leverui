import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

/** Run npm without a shell so package paths cannot change command parsing. */
const execFileAsync = promisify(execFile);

/** Read npm's actual archive paths without running package lifecycle scripts. */
export async function readPackedFiles(projectRoot) {
  const cacheRoot = await mkdtemp(join(tmpdir(), 'leverui-pack-cache-'));
  try {
    const { stdout } = await execFileAsync(
      'npm',
      ['pack', '--dry-run', '--ignore-scripts', '--json'],
      {
        cwd: projectRoot,
        env: { ...process.env, npm_config_cache: cacheRoot },
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    const [archive] = JSON.parse(stdout);
    assert.ok(Array.isArray(archive?.files), 'npm did not return a package file list.');
    const paths = new Set();
    for (const file of archive.files) paths.add(file.path);
    return paths;
  } finally {
    await rm(cacheRoot, { recursive: true, force: true });
  }
}
