import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Write the module the website loads for one demo family. It bundles the family's stories,
 * their authored source and their code panels behind one component, so a guide page can load
 * the family as a single chunk, render it while prerendering, and hydrate it in the browser.
 */
export async function writeFamilyModule(directory, family, hasPanels) {
  await mkdir(directory, { recursive: true });
  const panels = hasPanels
    ? `import panels from '../guide-example-source/${family}.json';`
    : 'const panels = {};';
  const source = `import * as stories from '../../../../demos/${family}';
import source from '../../../../demos/${family}.tsx?raw';
${panels}
import { guideFamily } from '../../components/guide-family';

export const parts = { stories, source, panels };
export default guideFamily(parts);
`;
  await writeFile(path.join(directory, `${family}.js`), source);
}
