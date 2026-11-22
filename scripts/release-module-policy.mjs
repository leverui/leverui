import assert from 'node:assert/strict';

const allowedZagModules = [
  /\/@zag-js\/utils\/dist\/(?:guard|functions)\.mjs$/,
  /\/@zag-js\/core\/dist\/merge-props\.mjs$/,
  /\/@zag-js\/anatomy\/dist\/create-anatomy\.mjs$/,
  /\/@zag-js\/[^/]+\/dist\/[^/]+\.anatomy\.mjs$/,
];

/** Require a Box-only browser bundle to omit other components and behavior. */
export function assertBoxOnlyModules(paths, packageRoot) {
  const components = paths
    .filter((path) => path.startsWith(`${packageRoot}/dist/components/`))
    .sort();
  assert.deepEqual(
    components,
    ['box.js', 'native-box.js'].map(
      /** Identify Box's browser-only implementation modules. */
      (name) => `${packageRoot}/dist/components/${name}`,
    ),
  );

  const serverModules = paths.filter((path) => path.startsWith(`${packageRoot}/dist/server/`));
  assert.deepEqual(serverModules, [], 'The browser bundle retained server modules.');

  const primitiveComponents = paths.filter((path) =>
    path.startsWith(`${packageRoot}/dist/primitives/components/`),
  );
  assert.deepEqual(primitiveComponents, [], 'A Box-only bundle retained interaction primitives.');

  const unexpectedZag = paths.filter(
    (path) =>
      path.includes('/node_modules/@zag-js/') &&
      !allowedZagModules.some((pattern) => pattern.test(path)),
  );
  assert.deepEqual(unexpectedZag, [], 'A Box-only bundle retained unexpected Zag code.');
}
