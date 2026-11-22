import { readFileSync } from 'node:fs';
import ts from 'typescript';
import {
  isInlinableFile,
  isLibraryFile,
  isPublicName,
  resolveModule,
} from './guide-example-package.mjs';

const packageEntries = new Set(['../../../src', '../../src', '../src']);
const parsedFiles = new Map();

/** Parse one source file once per generation run. */
export function parseFile(file) {
  if (!parsedFiles.has(file)) {
    const text = readFileSync(file, 'utf8');
    parsedFiles.set(
      file,
      ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
    );
  }
  return parsedFiles.get(file);
}

/** Reuse a source file the caller already parsed, so its nodes stay comparable. */
export function rememberFile(sourceFile) {
  parsedFiles.set(sourceFile.fileName, sourceFile);
}

/** Report whether an identifier refers to a binding, rather than naming a member, key or attribute. */
function isReference(node) {
  const parent = node.parent;
  if (ts.isPropertyAccessExpression(parent) || ts.isQualifiedName(parent)) {
    return node !== (ts.isQualifiedName(parent) ? parent.right : parent.name);
  }
  if (ts.isJsxAttribute(parent)) return false;
  if (ts.isBindingElement(parent)) return parent.propertyName !== node;
  const isMember =
    ts.isPropertyAssignment(parent) ||
    ts.isPropertyDeclaration(parent) ||
    ts.isPropertySignature(parent) ||
    ts.isMethodDeclaration(parent) ||
    ts.isMethodSignature(parent) ||
    ts.isAccessor(parent) ||
    ts.isEnumMember(parent);
  return !isMember || parent.name !== node;
}

/** Collect the identifiers that some statements refer to, ignoring strings, text and comments. */
export function referencedNames(statements) {
  const names = new Set();
  /** Record one node's identifier reference, then search its children. */
  function visit(node) {
    if (ts.isIdentifier(node) && isReference(node)) names.add(node.text);
    ts.forEachChild(node, visit);
  }
  for (const statement of statements) visit(statement);
  return names;
}

/** List the identifiers a binding declares, including destructured ones. */
function bindingNames(name) {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap(
    /** Collect each destructured element's names, skipping array holes. */
    (element) => (ts.isOmittedExpression(element) ? [] : bindingNames(element.name)),
  );
}

/** List the names a top-level statement declares for other statements to use. */
export function declaredNames(statement) {
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap(
      /** Collect every name the declaration binds. */
      (declaration) => bindingNames(declaration.name),
    );
  }
  const isNamed =
    ts.isFunctionDeclaration(statement) ||
    ts.isClassDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isEnumDeclaration(statement);
  return isNamed && statement.name ? [statement.name.text] : [];
}

/** Describe where a relative import's bindings come from. */
export function relativeSource(sourceFile, specifier) {
  if (packageEntries.has(specifier)) return { external: true, moduleName: '@leverui/components' };
  const file = resolveModule(sourceFile.fileName, specifier);
  const helper = file && isInlinableFile(file) ? file : undefined;
  return { external: false, moduleName: specifier, helper, library: helper && isLibraryFile(file) };
}

/** Point a library binding at the public package when the package exports its name. */
export function publicBinding(binding) {
  const original = binding.element?.propertyName?.text ?? binding.name;
  if (!binding.library || binding.kind !== 'named' || !isPublicName(original)) return binding;
  return { ...binding, external: true, moduleName: '@leverui/components', helper: undefined };
}

/** List every binding a file imports, noting whether a package or a helper provides it. */
export function importBindings(sourceFile) {
  return sourceFile.statements.filter(ts.isImportDeclaration).flatMap(
    /** Describe the default, namespace, named and bare forms of one import. */
    (statement) => {
      const clause = statement.importClause;
      if (!clause) return [];
      const specifier = statement.moduleSpecifier.text;
      const shared = {
        statement,
        ...(specifier.startsWith('.')
          ? relativeSource(sourceFile, specifier)
          : { external: true, moduleName: specifier }),
      };
      const named = clause.namedBindings;
      if (!clause.name && named && ts.isNamedImports(named) && named.elements.length === 0) {
        return [{ ...shared, kind: 'bare' }];
      }
      const elements = named && ts.isNamedImports(named) ? named.elements : [];
      return [
        ...(clause.name ? [{ ...shared, kind: 'default', name: clause.name.text }] : []),
        ...(named && ts.isNamespaceImport(named)
          ? [{ ...shared, kind: 'namespace', name: named.name.text }]
          : []),
        ...elements.map(
          /** Keep each named element for its alias and type-only modifier. */
          (element) =>
            publicBinding({ ...shared, kind: 'named', name: element.name.text, element }),
        ),
      ];
    },
  );
}
