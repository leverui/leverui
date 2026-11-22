/**
 * Read the props tables in the component guides and ask the TypeScript compiler whether each
 * documented prop exists on the component it documents. A guide's `## Props` section has one
 * table per part, under a `### Part` heading, or one table for a single component.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const compilerOptions = {
  strict: true,
  exactOptionalPropertyTypes: true,
  jsx: ts.JsxEmit.Preserve,
  jsxImportSource: '@solidjs/web',
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2022,
  skipLibCheck: true,
  noEmit: true,
  types: [],
};
const partPattern = /\.part-\d+\.md$/;

/** Turn a guide slug such as `date-picker` into a component name such as `DatePicker`. */
function pascalCase(slug) {
  return slug
    .split('-')
    .map(
      /** Capitalize one word. */
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

/** Read one guide with its continuation parts, in part order. */
function readGuide(directory, file) {
  const slug = file.replace(/\.md$/, '');
  const parts = readdirSync(directory)
    .filter(
      /** Keep this guide's continuation files. */
      (name) => name.startsWith(`${slug}.part-`),
    )
    .sort();
  return [file, ...parts]
    .map(
      /** Read one file. */
      (name) => readFileSync(join(directory, name), 'utf8'),
    )
    .join('\n');
}

/** List every documented prop: its guide, the part heading, and the prop name. */
export function readDocumentedProps(directory) {
  const rows = [];
  const files = readdirSync(directory).filter(
    /** Keep the guides that start a page. */
    (name) => name.endsWith('.md') && name !== 'README.md' && !partPattern.test(name),
  );
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const text = readGuide(directory, file);
    const section = /^## Props\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text)?.[1];
    if (!section) continue;
    const imports = [...text.matchAll(/import \{([^}]+)\} from '@leverui\/components'/g)].flatMap(
      /** Split one import list into names. */
      (match) => (match[1] ?? '').split(',').map((name) => name.trim()),
    );
    let part = '';
    for (const line of section.split('\n')) {
      const heading = /^### (.+)$/.exec(line);
      if (heading) {
        part = (heading[1] ?? '').replace(/[`\s]/g, '');
        continue;
      }
      const prop = /^\| `([^`]+)`/.exec(line)?.[1];
      if (prop) rows.push({ slug, part, prop, imports });
    }
  }
  return rows;
}

/** Find the props that the compiler does not accept on their documented component. */
export function findUnknownProps(projectRoot) {
  const entry = join(projectRoot, 'src/index.ts');
  const base = ts.createProgram([entry], compilerOptions);
  const checker = base.getTypeChecker();
  const entryFile = base.getSourceFile(entry);
  assert(entryFile, 'The package entry is missing.');
  const values = new Map();
  for (const symbol of checker.getExportsOfModule(checker.getSymbolAtLocation(entryFile))) {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    if (target.flags & ts.SymbolFlags.Value) {
      values.set(symbol.name, checker.getTypeOfSymbolAtLocation(target, entryFile));
    }
  }

  /** Name the component a table documents, such as `SelectRoot` or `Select.Root`. */
  function component(row) {
    const own = pascalCase(row.slug);
    const main = values.has(own)
      ? own
      : (row.imports.find(
          /** Take the first component the guide imports. */
          (name) => values.has(name) && /^[A-Z]/.test(name),
        ) ?? own);
    const mainType = values.get(main);
    if (row.part && values.has(main + row.part)) return main + row.part;
    if (row.part && mainType?.getProperty(row.part)) return `${main}.${row.part}`;
    if (row.part && values.has(row.part)) return row.part;
    if (mainType && !mainType.getCallSignatures().length && mainType.getProperty('Root')) {
      return `${main}.Root`;
    }
    return main;
  }

  const rows = readDocumentedProps(join(projectRoot, 'docs/components'));
  const checks = rows.map(
    /** Pair a row with the component it documents. */
    (row) => ({ ...row, component: component(row) }),
  );
  const unresolved = checks.filter(
    /** Keep rows whose component is not exported. */
    (check) => !values.has(check.component.split('.')[0] ?? ''),
  );
  const resolved = checks.filter(
    /** Keep rows with an exported component. */
    (check) => !unresolved.includes(check),
  );
  const names = [
    ...new Set(
      resolved.map(
        /** Read the exported name to import. */
        (check) => check.component.split('.')[0],
      ),
    ),
  ];
  const lines = [
    `import { ${names.join(', ')} } from './src/index';`,
    'type PropsOf<T> = T extends (...args: infer A) => unknown ? A[0] : never;',
    'type Keys<T> = T extends unknown ? keyof T : never;',
  ];
  const lineOf = new Map();
  for (const check of resolved) {
    lineOf.set(lines.length, check);
    lines.push(
      `export const check${lines.length}: Keys<PropsOf<typeof ${check.component}>> = '${check.prop}';`,
    );
  }
  const fileName = join(projectRoot, '__guide-props-check.ts');
  const host = ts.createCompilerHost(compilerOptions);
  const readFile = host.readFile;
  host.readFile =
    /** Serve the generated check file from memory. */
    (name) => (name === fileName ? lines.join('\n') : readFile(name));
  const fileExists = host.fileExists;
  host.fileExists =
    /** Report the in-memory check file as present. */
    (name) => name === fileName || fileExists(name);
  const program = ts.createProgram([fileName], compilerOptions, host, base);
  const file = program.getSourceFile(fileName);
  assert(file, 'The generated check file did not load.');
  const failures = [];
  for (const diagnostic of ts.getPreEmitDiagnostics(program, file)) {
    const line = file.getLineAndCharacterOfPosition(diagnostic.start ?? 0).line;
    const check = lineOf.get(line);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    failures.push(
      check ? `${check.slug}: <${check.component}> has no prop \`${check.prop}\`` : message,
    );
  }
  for (const check of unresolved) {
    failures.push(`${check.slug}: no exported component for the ${check.part || 'main'} table`);
  }
  return { checked: checks.length, failures };
}

/** Throw when a condition does not hold. */
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
