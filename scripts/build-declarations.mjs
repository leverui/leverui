import assert from 'node:assert/strict';
import { cp, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { compileBatch } from './declaration-compiler.mjs';
import { prepareDeclarationSnapshot } from './declaration-snapshot.mjs';
import { declarationManifest, openDeclarationWorkspace } from './declaration-workspace.mjs';
import {
  removeOldDeclarations,
  verifyDeclarationEntries,
  verifyDeclarationGraph,
  writeDeclarationPassthrough,
} from './declaration-output.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = join(projectRoot, 'src');
const entryFile = join(sourceRoot, 'index.ts');
const batchSize = 16;
const memoryMiB = Number(process.env.LEVERUI_DECLARATION_MEMORY_MIB ?? 2048);

if (!Number.isInteger(memoryMiB) || memoryMiB < 256) {
  throw new Error('LEVERUI_DECLARATION_MEMORY_MIB must be an integer of at least 256.');
}

/** Read strict declaration settings and all source roots without creating a program. */
function buildOptions() {
  const file = join(projectRoot, 'tsconfig.build.json');
  const config = ts.readConfigFile(file, ts.sys.readFile);
  if (config.error)
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectRoot);
  assert.equal(parsed.errors.length, 0, 'Declaration tsconfig has errors.');
  const sourceFiles = parsed.fileNames.filter(
    /** Check every authored source module, excluding declaration inputs. */
    (file) => file.startsWith(`${sourceRoot}/`) && /\.tsx?$/.test(file) && !file.endsWith('.d.ts'),
  );
  return { options: parsed.options, sourceFiles };
}

/** Resolve a re-export through TypeScript's own module resolver. */
function resolveEntry(specifier, fromFile, options) {
  const resolved = ts.resolveModuleName(specifier, fromFile, options, ts.sys).resolvedModule;
  assert.ok(resolved, `Unresolved public entry: ${specifier}`);
  assert.ok(resolved.resolvedFileName.startsWith(`${sourceRoot}/`), `External entry: ${specifier}`);
  return resolved.resolvedFileName;
}

/** Follow public re-exports while keeping declaration-only modules lightweight. */
async function publicEntries(options) {
  const entries = new Set();
  const leaves = new Set();
  const passthrough = new Map();

  /** Visit each public module once, preserving pure re-export syntax. */
  async function visit(file) {
    if (entries.has(file)) return;
    entries.add(file);
    const source = await readFile(file, 'utf8');
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const exportsOnly =
      tree.statements.length > 0 &&
      tree.statements.every(
        /** Keep modules with declarations in the compiler's checked graph. */
        (statement) =>
          ts.isExportDeclaration(statement) &&
          statement.moduleSpecifier &&
          ts.isStringLiteralLike(statement.moduleSpecifier) &&
          statement.moduleSpecifier.text.startsWith('.'),
      );
    if (!exportsOnly) {
      leaves.add(file);
      return;
    }
    passthrough.set(file, source);
    for (const statement of tree.statements) {
      const target = resolveEntry(statement.moduleSpecifier.text, file, options);
      await visit(target);
    }
  }

  await visit(entryFile);
  assert.ok(passthrough.has(entryFile), 'The package root must contain only re-exports.');
  return { entries: [...entries], leaves: [...leaves], passthrough };
}

/** Emit the complete public declaration graph without a whole-project process. */
async function main() {
  const { options, sourceFiles } = buildOptions();
  const { entries, leaves, passthrough } = await publicEntries(options);
  const checkedFiles = sourceFiles.filter(
    /** Public pure re-exports are verified by the final declaration graph. */
    (file) => !passthrough.has(file),
  );
  if (process.argv.includes('--plan')) {
    for (const [index, file] of checkedFiles.entries()) {
      console.log(`${index + 1}: ${relative(sourceRoot, file)}`);
    }
    return;
  }
  const resumeArg = process.argv.find(
    /** Identify an explicitly requested interrupted workspace. */
    (argument) => argument.startsWith('--resume='),
  );
  const manifest = await declarationManifest(projectRoot, checkedFiles, batchSize, ts.version);
  const temporaryRoot = await openDeclarationWorkspace(
    projectRoot,
    resumeArg?.slice('--resume='.length),
    manifest,
  );
  let complete = false;
  try {
    const { checkRoot, outputRoot } = await prepareDeclarationSnapshot(
      projectRoot,
      temporaryRoot,
      memoryMiB,
    );
    console.log(`Checking ${checkedFiles.length} modules; ${leaves.length} public leaves.`);
    const total = Math.ceil(checkedFiles.length / batchSize);
    for (let offset = 0; offset < checkedFiles.length; offset += batchSize) {
      await compileBatch(
        checkedFiles.slice(offset, offset + batchSize),
        temporaryRoot,
        checkRoot,
        outputRoot,
        Math.floor(offset / batchSize) + 1,
        total,
        memoryMiB,
      );
    }
    await writeDeclarationPassthrough(passthrough, sourceRoot, outputRoot);
    await verifyDeclarationEntries(sourceFiles, sourceRoot, outputRoot);
    await verifyDeclarationEntries(entries, sourceRoot, outputRoot);
    verifyDeclarationGraph(outputRoot, memoryMiB);
    assert.deepEqual(
      await declarationManifest(projectRoot, checkedFiles, batchSize, ts.version),
      manifest,
      'Declaration inputs changed during the build.',
    );
    const destination = join(projectRoot, 'dist');
    await removeOldDeclarations(destination);
    await cp(outputRoot, destination, { recursive: true });
    console.log(`Built declarations for ${entries.length} public modules.`);
    complete = true;
  } finally {
    if (complete) await rm(temporaryRoot, { recursive: true, force: true });
    else console.error(`Resume interrupted declarations with --resume=${temporaryRoot}`);
  }
}

await main();
