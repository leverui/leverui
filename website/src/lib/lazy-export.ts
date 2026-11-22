import { lazy, type Component } from 'solid-js';

/**
 * Lazily render one named component export. Pass the loader as
 * `() => import('literal path')` so Vite still sees the path and code-splits it.
 */
export function lazyExport<Name extends string>(
  load: () => Promise<{ readonly [Key in Name]: Component }>,
  name: Name,
): Component {
  return lazy(
    /** Expose the loaded module's named export as the lazy component's default. */
    async () => ({ default: (await load())[name] }),
  );
}
