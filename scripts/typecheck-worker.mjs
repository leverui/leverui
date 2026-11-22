import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const configPath = resolve(process.argv[2] ?? '');
const files = process.argv.slice(3).map(
  /** Resolve each requested root without relying on the caller's directory. */
  (file) => resolve(file),
);
assert.ok(process.argv[2] && files.length > 0, 'Provide a tsconfig and source roots.');

const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) {
  throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
}
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectRoot);
assert.equal(parsed.errors.length, 0, 'TypeScript configuration has errors.');
const options = {
  ...parsed.options,
  noEmit: true,
  types: [...new Set([...(parsed.options.types ?? []), '@testing-library/jest-dom/vitest'])],
};
const host = ts.createCompilerHost(options);
const sourceIndex = join(projectRoot, 'src/index.ts');
const publishedIndex = join(projectRoot, 'dist/index.d.ts');

/** Use freshly checked declarations when a test imports the whole public root. */
function resolveImport(specifier, fromFile) {
  const resolved = ts.resolveModuleName(specifier, fromFile, options, host).resolvedModule;
  if (resolved?.resolvedFileName !== sourceIndex) return resolved;
  return { ...resolved, resolvedFileName: publishedIndex, extension: ts.Extension.Dts };
}

/** Keep each source or test batch below the compiler's memory limit. */
host.resolveModuleNames = (moduleNames, containingFile) =>
  moduleNames.map(
    /** Resolve imports with the same compiler options as the project. */
    (specifier) => resolveImport(specifier, containingFile),
  );

const program = ts.createProgram(
  [
    ...files,
    join(projectRoot, '.storybook/css-modules.d.ts'),
    join(projectRoot, '.storybook/asset-urls.d.ts'),
  ],
  options,
  host,
);
const diagnostics = [...program.getOptionsDiagnostics(), ...program.getGlobalDiagnostics()];
for (const file of files) {
  const sourceFile = program.getSourceFile(file);
  assert.ok(sourceFile, `TypeScript did not load configured root: ${file}`);
  diagnostics.push(...program.getSyntacticDiagnostics(sourceFile));
  diagnostics.push(...program.getSemanticDiagnostics(sourceFile));
}
if (diagnostics.length > 0) {
  const diagnosticHost = {
    /** Preserve displayed paths from the compiler diagnostic. */
    getCanonicalFileName: (file) => file,
    /** Resolve displayed diagnostics from the package root. */
    getCurrentDirectory: () => projectRoot,
    /** Keep diagnostics stable across host platforms. */
    getNewLine: () => '\n',
  };
  throw new Error(ts.formatDiagnostics(diagnostics, diagnosticHost));
}
