import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = resolve(process.argv[2] ?? '');
assert.ok(process.argv[2], 'Provide the emitted declaration directory.');

const config = ts.readConfigFile(`${projectRoot}/tsconfig.json`, ts.sys.readFile);
if (config.error) {
  throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
}
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectRoot);
assert.equal(parsed.errors.length, 0, 'TypeScript configuration has errors.');
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const entryFiles = Object.values(manifest.exports)
  .filter(
    /** Select the package paths that expose declaration entries. */
    (entry) => typeof entry === 'object' && typeof entry.types === 'string',
  )
  .map(
    /** Resolve a published declaration inside the pending output tree. */
    (entry) => {
      assert.ok(entry.types.startsWith('./dist/'), `Unexpected type entry: ${entry.types}`);
      return resolve(outputRoot, entry.types.slice('./dist/'.length));
    },
  );
assert.ok(entryFiles.length > 0, 'The package has no published declaration entries.');
const program = ts.createProgram(entryFiles, {
  ...parsed.options,
  noEmit: true,
  skipLibCheck: false,
});

/** Keep our emitted diagnostics while excluding upstream package declarations. */
function isPublicDiagnostic(diagnostic) {
  if (!diagnostic.file) return true;
  const path = relative(outputRoot, diagnostic.file.fileName);
  return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

const diagnostics = ts.getPreEmitDiagnostics(program).filter(isPublicDiagnostic);
if (diagnostics.length > 0) {
  const host = {
    /** Preserve displayed paths from the compiler diagnostic. */
    getCanonicalFileName: (file) => file,
    /** Resolve displayed diagnostics from the package root. */
    getCurrentDirectory: () => projectRoot,
    /** Keep diagnostics stable across host platforms. */
    getNewLine: () => '\n',
  };
  throw new Error(ts.formatDiagnostics(diagnostics, host));
}
console.log(`Verified ${entryFiles.length} public declaration entries.`);
