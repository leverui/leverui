import { spawnSync } from 'node:child_process';
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Check every public module has an emitted declaration before publishing. */
export async function verifyDeclarationEntries(entries, sourceRoot, outputRoot) {
  for (const entry of entries) {
    const path = join(outputRoot, relative(sourceRoot, entry).replace(/\.tsx?$/, '.d.ts'));
    await access(path);
  }
}

/** Check emitted public exports without trusting unchecked copied barrels. */
export function verifyDeclarationGraph(outputRoot, memoryMiB) {
  const verifier = new URL('./verify-declaration-graph.mjs', import.meta.url);
  const result = spawnSync(
    process.execPath,
    [`--max-old-space-size=${memoryMiB}`, fileURLToPath(verifier), outputRoot],
    {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
      timeout: 180_000,
      killSignal: 'SIGKILL',
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Public declaration graph failed:\n${result.stdout}\n${result.stderr}`);
  }
}

/** Write a pure re-export module as a valid declaration file. */
export async function writeDeclarationPassthrough(passthrough, sourceRoot, outputRoot) {
  for (const [file, source] of passthrough) {
    const path = join(outputRoot, relative(sourceRoot, file).replace(/\.tsx?$/, '.d.ts'));
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, source);
  }
}

/** Remove old declaration artifacts while retaining runtime JS and CSS. */
export async function removeOldDeclarations(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await removeOldDeclarations(path);
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) await rm(path);
  }
}
