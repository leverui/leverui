import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

const barrelImport = /import\s*\{([^}]*)\}\s*from\s*['"]@lucide\/solid['"];?/g;
const exportLine = /export \{([^}]*)\} from '\.\/icons\/([a-z0-9-]+)\.mjs';/g;
const sourceFile = /\.[jt]sx?$/;

/** Map every exported icon name, alias, and suffix form to its icon file. */
function readIconFiles(): Map<string, string> {
  const entry = createRequire(import.meta.url).resolve('@lucide/solid');
  const barrel = readFileSync(join(dirname(entry), '..', 'esm', 'lucide-solid.mjs'), 'utf8');
  const files = new Map<string, string>();
  for (const [, names = '', file = ''] of barrel.matchAll(exportLine)) {
    for (const name of names.split(',')) {
      files.set(name.replace('default as', '').trim(), file);
    }
  }
  return files;
}

/** Rewrite one named barrel import as per-icon default imports when every name is known. */
function rewriteImport(statement: string, specifiers: string, files: Map<string, string>): string {
  const imports: string[] = [];
  for (const specifier of specifiers.split(',').map((part) => part.trim())) {
    if (!specifier) continue;
    const [imported = '', local = imported] = specifier.split(/\s+as\s+/);
    const file = files.get(imported);
    if (!file) return statement;
    imports.push(`import ${local} from '@lucide/solid/icons/${file}';`);
  }
  return imports.join(' ') + '\n'.repeat(statement.split('\n').length - 1);
}

/** Tell whether a match sits inside a template literal, as in displayed example code. */
function insideTemplate(code: string, offset: number): boolean {
  const ticks = code.slice(0, offset).match(/(?<!\\)`/g);
  return (ticks?.length ?? 0) % 2 === 1;
}

/**
 * Load each Lucide icon from its own module instead of the package barrel.
 * The barrel holds thousands of Solid source modules that the dev server would
 * otherwise compile and request one by one on every page.
 */
export function lucideIconImports(): Plugin {
  let files: Map<string, string> | undefined;
  return {
    name: 'leverui-lucide-icon-imports',
    enforce: 'pre',
    /** Replace barrel imports in authored source files. */
    transform(code, id) {
      if (id.includes('/node_modules/') || !sourceFile.test(id.split('?')[0] ?? '')) return null;
      if (!code.includes('@lucide/solid')) return null;
      files ??= readIconFiles();
      const iconFiles = files;
      const rewritten = code.replace(
        barrelImport,
        /** Swap one real import statement for its per-icon form on the same line. */
        (statement, specifiers: string, offset: number) =>
          insideTemplate(code, offset)
            ? statement
            : rewriteImport(statement, specifiers, iconFiles),
      );
      return rewritten === code ? null : { code: rewritten, map: null };
    },
  };
}
