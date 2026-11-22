import { realpath } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'vite';
import solid from '@solidjs/vite-plugin';
import { assertBoxOnlyModules } from './release-module-policy.mjs';

/** Build one public Box import and inspect the modules Rollup retained. */
export async function verifyBoxTreeShaking(directory) {
  const result = await build({
    configFile: false,
    root: directory,
    plugins: [solid()],
    build: {
      write: false,
      minify: false,
      lib: { entry: join(directory, 'src/release-tree-shake.tsx'), formats: ['es'] },
    },
  });
  const builds = Array.isArray(result) ? result : [result];
  const modules = new Set();
  for (const output of builds) {
    for (const chunk of output.output) {
      if (chunk.type !== 'chunk') continue;
      for (const path of Object.keys(chunk.modules)) modules.add(path);
    }
  }
  const packageRoot = await realpath(join(directory, 'node_modules/@leverui/components'));
  assertBoxOnlyModules([...modules], packageRoot);
  console.log(`Packed tree shaking retained ${modules.size} modules without interaction code.`);
}
