import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { exampleDescription } from './guide-example-display.mjs';
import { writeFamilyModule } from './guide-family-module.mjs';
import { exampleSource } from './guide-example-module.mjs';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const demoDirectory = path.join(projectRoot, 'demos');
const outputDirectory = path.join(projectRoot, 'website/src/generated/guide-example-source');
const familyDirectory = path.join(projectRoot, 'website/src/generated/guide-families');
const sourceCache = new Map();

/** Parse one maintained TypeScript source file once per generation run. */
async function readSource(file) {
  const cached = sourceCache.get(file);
  if (cached) return cached;
  const text = await readFile(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = { text, ast };
  sourceCache.set(file, result);
  return result;
}

/** Resolve imported render names to the files containing their implementations. */
function importedRenders(ast, storyFile) {
  const imports = new Map();
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    const named = statement.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    const modulePath = statement.moduleSpecifier.text;
    if (!modulePath.startsWith('./')) continue;
    for (const specifier of named.elements) {
      imports.set(specifier.name.text, {
        name: specifier.propertyName?.text ?? specifier.name.text,
        file: path.resolve(path.dirname(storyFile), `${modulePath}.tsx`),
      });
    }
  }
  return imports;
}

/** Find a render function or function-valued export by its source name. */
function renderDeclaration(ast, name) {
  for (const statement of ast.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) return statement;
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return statement;
      }
    }
  }
  return undefined;
}

/** Follow a local re-export when a long story is split into smaller source files. */
async function resolveReexport(source, file, name) {
  for (const statement of source.ast.statements) {
    if (!ts.isExportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
    const match = statement.exportClause.elements.find(
      /** Find the local export with this renderer's public name. */
      (element) => element.name.text === name,
    );
    if (!match) continue;
    const nextFile = path.resolve(path.dirname(file), `${statement.moduleSpecifier.text}.tsx`);
    const nextSource = await readSource(nextFile);
    const nextName = match.propertyName?.text ?? name;
    return {
      source: nextSource,
      file: nextFile,
      node: renderDeclaration(nextSource.ast, nextName),
    };
  }
  return undefined;
}

/** Find the default component used by stories without a custom render. */
function defaultRenderName(ast) {
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== 'meta') continue;
      if (!ts.isSatisfiesExpression(declaration.initializer)) continue;
      const object = declaration.initializer.expression;
      if (!ts.isObjectLiteralExpression(object)) continue;
      const component = object.properties.find(
        /** Identify Storybook's default component. */
        (property) => ts.isPropertyAssignment(property) && property.name.getText() === 'component',
      );
      if (
        component &&
        ts.isPropertyAssignment(component) &&
        ts.isIdentifier(component.initializer)
      ) {
        return component.initializer.text;
      }
    }
  }
  return undefined;
}

/** Read one Storybook export's render identifier. */
function storyRenderName(declaration, fallback) {
  if (!ts.isObjectLiteralExpression(declaration.initializer)) return undefined;
  const render = declaration.initializer.properties.find(
    /** Select the actual example renderer rather than Storybook metadata. */
    (property) => ts.isPropertyAssignment(property) && property.name.getText() === 'render',
  );
  return render && ts.isPropertyAssignment(render) && ts.isIdentifier(render.initializer)
    ? render.initializer.text
    : fallback;
}

/** Collect exact example source for one Storybook component family. */
async function collectFamily(storyFile) {
  const { ast } = await readSource(storyFile);
  const imports = importedRenders(ast, storyFile);
  const defaultRender = defaultRenderName(ast);
  const examples = {};
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (
      !statement.modifiers?.some(
        /** Include only examples exposed to Storybook. */
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text === 'meta') continue;
      const renderName = storyRenderName(declaration, defaultRender);
      if (!renderName) {
        examples[declaration.name.text] = {
          code: await exampleSource(ast, statement, declaration.name.text),
          description: '',
          file: path.relative(projectRoot, storyFile),
        };
        continue;
      }
      const imported = imports.get(renderName);
      let source = { ast };
      let sourcePath = storyFile;
      try {
        if (imported) {
          sourcePath = imported.file;
          source = await readSource(imported.file);
        }
      } catch {
        continue;
      }
      let functionNode = renderDeclaration(source.ast, imported?.name ?? renderName);
      if (!functionNode) {
        const resolved = await resolveReexport(source, sourcePath, imported?.name ?? renderName);
        if (resolved) {
          source = resolved.source;
          sourcePath = resolved.file;
          functionNode = resolved.node;
        }
      }
      if (!functionNode) continue;
      const code = await exampleSource(source.ast, functionNode, declaration.name.text);
      examples[declaration.name.text] = {
        code,
        description: exampleDescription(functionNode),
        file: path.relative(projectRoot, sourcePath),
      };
    }
  }
  return examples;
}

/** Create browser-loadable source panels from the maintained Solid examples. */
async function generate() {
  await mkdir(outputDirectory, { recursive: true });
  const files = (await readdir(demoDirectory)).filter(
    /** Read each demo family registry; helpers at the root are `.ts` or `.css`. */
    (name) => name.endsWith('.tsx'),
  );
  let count = 0;
  for (const name of files) {
    const family = name.replace(/\.tsx$/, '');
    const examples = await collectFamily(path.join(demoDirectory, name));
    await writeFamilyModule(familyDirectory, family, Object.keys(examples).length > 0);
    if (Object.keys(examples).length === 0) continue;
    await writeFile(path.join(outputDirectory, `${family}.json`), `${JSON.stringify(examples)}\n`);
    count += Object.keys(examples).length;
  }
  console.log(`Generated source for ${count} Solid examples across ${files.length} demo families.`);
}

await generate();
