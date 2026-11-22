import {
  declaredNames,
  importBindings,
  parseFile,
  referencedNames,
  rememberFile,
} from './guide-example-bindings.mjs';
import { formatModule } from './guide-example-format.mjs';
import { simplifiedModule } from './guide-example-simplify.mjs';
import { helperDeclaration, UnresolvedBindingError } from './guide-example-helpers.mjs';
import { projectPath } from './guide-example-package.mjs';

/** Add one statement to the example, reporting whether it was new. */
function include(collection, sourceFile, statement) {
  if (!collection.included.has(sourceFile)) collection.included.set(sourceFile, new Set());
  const statements = collection.included.get(sourceFile);
  if (statements.has(statement)) return false;
  statements.add(statement);
  return true;
}

/** Include a file's own declarations and imported helpers that its code refers to. */
function growFile(sourceFile, collection, context) {
  let grew = false;
  const references = referencedNames(collection.included.get(sourceFile));
  for (const statement of sourceFile.statements) {
    if (
      declaredNames(statement).some(
        /** Check whether the included code refers to this declared name. */
        (name) => references.has(name),
      )
    ) {
      grew = include(collection, sourceFile, statement) || grew;
    }
  }
  for (const binding of importBindings(sourceFile)) {
    if (binding.external || binding.kind === 'bare' || !references.has(binding.name)) continue;
    const { target, declaration } = helperDeclaration(binding, context);
    collection.dependencies.get(sourceFile).add(target);
    if (!collection.dependencies.has(target)) collection.dependencies.set(target, new Set());
    grew = include(collection, target, declaration) || grew;
  }
  return grew;
}

/** Collect the example and every declaration it depends on, across helper files. */
function collectDeclarations(sourceFile, node) {
  rememberFile(sourceFile);
  const context = {
    example: declaredNames(node)[0] ?? 'unnamed',
    file: projectPath(sourceFile.fileName),
  };
  const collection = {
    included: new Map([[sourceFile, new Set([node])]]),
    dependencies: new Map([[sourceFile, new Set()]]),
  };
  for (let grew = true; grew;) {
    grew = false;
    for (const file of [...collection.included.keys()]) {
      grew = growFile(file, collection, context) || grew;
    }
  }
  return collection;
}

/** Name a package import, keeping its alias and type-only marker. */
function importedName(binding, sourceFile) {
  const name = binding.element.getText(sourceFile);
  return binding.statement.importClause.isTypeOnly ? `type ${name}` : name;
}

/** Write a merged named import, dropping type-only names that are also imported as values. */
function namedImport(moduleName, names) {
  const kept = [...names].filter(
    /** Keep a type-only name only when its value is not imported too. */
    (name) => !name.startsWith('type ') || !names.has(name.slice(5)),
  );
  return `import { ${kept.join(', ')} } from '${moduleName}';`;
}

/** Write a package's whole-module import: a default, a namespace, or a bindingless type import. */
function moduleImport(binding, sourceFile) {
  if (binding.kind === 'default') return `import ${binding.name} from '${binding.moduleName}';`;
  if (binding.kind === 'namespace') {
    return `import * as ${binding.name} from '${binding.moduleName}';`;
  }
  const relative = binding.statement.moduleSpecifier.text.startsWith('.');
  return relative ? undefined : binding.statement.getText(sourceFile);
}

/** Merge the package imports that the included declarations still need. */
function mergedImports(included) {
  const modules = new Map();
  const wholeModules = [];
  for (const [sourceFile, statements] of included) {
    const references = referencedNames(statements);
    for (const binding of importBindings(sourceFile)) {
      if (!binding.external) continue;
      if (binding.kind !== 'bare' && !references.has(binding.name)) continue;
      if (binding.kind !== 'named') {
        const line = moduleImport(binding, sourceFile);
        if (line && !wholeModules.includes(line)) wholeModules.push(line);
        continue;
      }
      if (!modules.has(binding.moduleName)) modules.set(binding.moduleName, new Set());
      modules.get(binding.moduleName).add(importedName(binding, sourceFile));
    }
  }
  return [
    ...[...modules].map(
      /** Write one merged import per package. */
      ([moduleName, names]) => namedImport(moduleName, names),
    ),
    ...wholeModules,
  ];
}

/** Order the included files so each one follows the helpers it imports. */
function dependencyOrder(dependencies) {
  const ordered = [];
  const seen = new Set();
  /** Visit a file's helpers, in import order, before recording the file itself. */
  function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    for (const { helper } of importBindings(file)) {
      if (helper && dependencies.has(parseFile(helper))) visit(parseFile(helper));
    }
    for (const helper of dependencies.get(file)) visit(helper);
    ordered.push(file);
  }
  for (const file of dependencies.keys()) visit(file);
  return ordered;
}

/** Print the included declarations, with helper files before the example. */
function printDeclarations({ included, dependencies }, node) {
  return dependencyOrder(dependencies)
    .flatMap(
      /** Print one file's included statements in their source order. */
      (sourceFile) =>
        sourceFile.statements
          .filter(
            /** Keep the statements the example depends on. */
            (statement) => included.get(sourceFile).has(statement),
          )
          .map(
            /** Export only the example itself; helpers become module-private. */
            (statement) => {
              const text = statement.getText(sourceFile);
              if (statement !== node) return text.replace(/^export\s+(?:default\s+)?/, '');
              return text.startsWith('export ') ? text : `export ${text}`;
            },
          ),
    )
    .join('\n\n');
}

/** Build a standalone, Prettier-formatted module from one example and its references. */
async function exampleModule(sourceFile, node) {
  const collection = collectDeclarations(sourceFile, node);
  const body = printDeclarations(collection, node);
  const header = mergedImports(collection.included);
  const source = `${header.join('\n')}\n\n${body}`;
  return formatModule(simplifiedModule(source), sourceFile.fileName);
}

/**
 * Build an example's module, or warn and return no code when it cannot stand alone, so the
 * guide hides that example's Code tab rather than showing source that does not compile.
 */
export async function exampleSource(sourceFile, node, story) {
  try {
    return await exampleModule(sourceFile, node);
  } catch (error) {
    if (!(error instanceof UnresolvedBindingError)) throw error;
    console.warn(`Omitting code for the ${story} story. ${error.message}`);
    return undefined;
  }
}
