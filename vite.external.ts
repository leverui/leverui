import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  dependencies: Record<string, string>;
};
const dependencies = Object.keys(manifest.dependencies);

/** Keep runtime dependencies external to browser and server bundles. */
export function isExternalDependency(id: string): boolean {
  if (solidImportFromResolvedId(id)) return true;
  for (const dependency of dependencies) {
    if (id === dependency || id.startsWith(`${dependency}/`)) return true;
  }
  return false;
}

/** Restore Solid's public import after Vite's JSX transform resolves its file. */
function solidImportFromResolvedId(id: string): string | undefined {
  if (id.split('/node_modules/@solidjs/web/')[1]?.startsWith('dist/')) return '@solidjs/web';
  if (id.split('/node_modules/solid-js/')[1]?.startsWith('dist/')) return 'solid-js';
  return undefined;
}

/** Emit public Solid package specifiers for pre-resolved JSX imports. */
export function externalImportPath(id: string): string {
  return solidImportFromResolvedId(id) ?? id;
}

/** Stop package imports before Vite resolves them to local pnpm store paths. */
export function externalDependenciesPlugin(): Plugin {
  return {
    name: 'leverui-external-dependencies',
    enforce: 'pre',
    /** Keep published imports stable in isolated consumer installations. */
    resolveId(id) {
      const solidImport = solidImportFromResolvedId(id);
      if (solidImport) return { id: solidImport, external: true };
      if (isExternalDependency(id)) return { id, external: true };
      return undefined;
    },
  };
}
