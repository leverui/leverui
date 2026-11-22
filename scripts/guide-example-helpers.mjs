import ts from 'typescript';
import {
  declaredNames,
  importBindings,
  parseFile,
  publicBinding,
  relativeSource,
} from './guide-example-bindings.mjs';
import { projectPath } from './guide-example-package.mjs';

/** Read the local name behind a helper file's default export, if it has one. */
function defaultExportName(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      return ts.isIdentifier(statement.expression) ? statement.expression.text : undefined;
    }
    const isDefault = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement)?.some(
          /** Detect the default keyword on a declaration. */
          (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
        )
      : false;
    if (isDefault) return declaredNames(statement)[0];
  }
  return undefined;
}

/** Reports an example binding that cannot be resolved to a package or an inlined helper. */
export class UnresolvedBindingError extends Error {}

/** Stop generation, naming the example and the binding it cannot resolve. */
function unresolved(context, binding, reason) {
  throw new UnresolvedBindingError(
    `Cannot generate the ${context.example} example in ${context.file}: ` +
      `"${binding.name}" from '${binding.moduleName}' ${reason}.`,
  );
}

/** Find the import or module through which a helper file re-exports a name. */
function reexportedBinding(sourceFile, name) {
  for (const statement of sourceFile.statements) {
    const clause = ts.isExportDeclaration(statement) ? statement.exportClause : undefined;
    if (!clause || !ts.isNamedExports(clause)) continue;
    const element = clause.elements.find(
      /** Match the export that publishes this name. */
      (candidate) => candidate.name.text === name,
    );
    if (!element) continue;
    const local = element.propertyName?.text ?? name;
    if (!statement.moduleSpecifier) {
      return importBindings(sourceFile).find(
        /** Match the import that the local re-export forwards. */
        (binding) => binding.name === local,
      );
    }
    const source = relativeSource(sourceFile, statement.moduleSpecifier.text);
    return publicBinding({ statement, ...source, kind: 'named', name: local });
  }
  return undefined;
}

/** Follow a helper import, and any re-exports, to the statement that declares it. */
function resolveHelper(binding, context) {
  if (!binding.helper)
    unresolved(
      context,
      binding,
      'cannot be inlined: it is outside demos and src, or is JavaScript typed by a declaration file',
    );
  if (binding.kind === 'namespace') unresolved(context, binding, 'is a namespace import');
  const target = parseFile(binding.helper);
  const name =
    binding.kind === 'default'
      ? defaultExportName(target)
      : (binding.element?.propertyName?.text ?? binding.name);
  if (!name) unresolved(context, binding, 'is an anonymous default export');
  const declaration = target.statements.find(
    /** Match the top-level statement that declares the imported name. */
    (statement) => declaredNames(statement).includes(name),
  );
  if (declaration) return { target, declaration, name };
  const forwarded = reexportedBinding(target, name);
  if (forwarded && !forwarded.external) return resolveHelper(forwarded, context);
  const helper = projectPath(binding.helper);
  return unresolved(context, binding, `has no top-level declaration "${name}" in ${helper}`);
}

/** Find the helper declaration that a referenced relative import stands for. */
export function helperDeclaration(binding, context) {
  const resolved = resolveHelper(binding, context);
  if (resolved.name !== binding.name) {
    unresolved(context, binding, `is declared as "${resolved.name}"; import it under that name`);
  }
  return resolved;
}
