import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const libraryRoot = path.join(projectRoot, 'src');
const demoRoot = path.join(projectRoot, 'demos');
const moduleExtensions = ['.tsx', '.ts', '.mjs', '.js'];
let publicNames;

/** Resolve a relative module path to its source file, trying each module extension. */
export function resolveModule(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    ...(moduleExtensions.includes(path.extname(base)) ? [base] : []),
    ...moduleExtensions.map(
      /** Try the path with one module extension. */
      (extension) => `${base}${extension}`,
    ),
    ...moduleExtensions.map(
      /** Try the folder's index module. */
      (extension) => path.join(base, `index${extension}`),
    ),
  ];
  return candidates.find(
    /** Keep the first candidate that exists. */
    (candidate) => existsSync(candidate),
  );
}

/** Show a file's path relative to the repository root, for error messages. */
export function projectPath(file) {
  return path.relative(projectRoot, file);
}

/** Report whether a file is part of the library source behind the public package. */
export function isLibraryFile(file) {
  return file.startsWith(`${libraryRoot}${path.sep}`);
}

/** Report whether a JavaScript file takes its types from a declaration file beside it. */
function hasDeclarationFile(file) {
  const base = file.replace(/\.m?js$/, '');
  return (
    base !== file &&
    ['.d.mts', '.d.ts'].some(
      /** Check for one declaration file extension. */
      (extension) => existsSync(`${base}${extension}`),
    )
  );
}

/**
 * Report whether generated examples may inline a file's declarations. JavaScript typed by a
 * separate declaration file is excluded, because its inlined code would lose those types.
 */
export function isInlinableFile(file) {
  const inside = isLibraryFile(file) || file.startsWith(`${demoRoot}${path.sep}`);
  return inside && !hasDeclarationFile(file);
}

/** Add the names one entry module exports, following its star re-exports. */
function collectExports(file, names, visited) {
  if (visited.has(file)) return;
  visited.add(file);
  const text = readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false);
  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      const clause = statement.exportClause;
      if (clause && ts.isNamedExports(clause)) {
        for (const element of clause.elements) names.add(element.name.text);
      } else if (clause) {
        names.add(clause.name.text);
      } else if (statement.moduleSpecifier) {
        const target = resolveModule(file, statement.moduleSpecifier.text);
        if (target) collectExports(target, names, visited);
      }
      continue;
    }
    const exported = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement)?.some(
          /** Detect a directly exported declaration. */
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        )
      : false;
    if (exported && statement.name && ts.isIdentifier(statement.name)) {
      names.add(statement.name.text);
    }
    if (exported && ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    }
  }
}

/** Report whether the public package entry exports a name. */
export function isPublicName(name) {
  if (!publicNames) {
    publicNames = new Set();
    collectExports(path.join(libraryRoot, 'index.ts'), publicNames, new Set());
  }
  return publicNames.has(name);
}
