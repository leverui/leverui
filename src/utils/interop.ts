/** Resolves the default export of a module when one is present. */
export function interopDefault<T>(mod: T): T {
  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    return (mod.default || mod) as T;
  }
  return mod;
}
