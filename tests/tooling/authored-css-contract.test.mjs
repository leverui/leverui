import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { verifyAuthoredCssContract } from '../../scripts/authored-css-contract.mjs';

const styleDirectory = new URL('../../src/styles/', import.meta.url);

/** Load the same authored fragments used by the default stylesheet build. */
async function loadSources() {
  const names = (await readdir(styleDirectory)).filter(
    /** Keep CSS sources and ignore other directory entries. */
    (name) => name.endsWith('.css'),
  );
  return new Map(
    await Promise.all(
      names.map(
        /** Preserve the filename for family-specific coverage checks. */
        async (name) => [name, await readFile(new URL(name, styleDirectory), 'utf8')],
      ),
    ),
  );
}

const sources = await loadSources();

/** Confirm every currently migrated family satisfies its declared CSS contract. */
function verifiesCurrentSources() {
  assert.doesNotThrow(
    /** Check the complete authored source map. */
    () => verifyAuthoredCssContract(sources),
  );
}

/** Confirm removing a public Dialog part fails the stylesheet gate. */
function rejectsMissingPart() {
  const broken = new Map(sources);
  const css = broken.get('dialog-layout.css');
  assert.ok(css);
  broken.set('dialog-layout.css', css.replace('.leverui-dialog__title', '.missing-dialog-title'));
  assert.throws(
    /** Check the altered Dialog source. */
    () => verifyAuthoredCssContract(broken),
    /Missing authored dialog CSS selector: \.leverui-dialog__title/,
  );
}

/** Confirm a comment cannot satisfy a missing finite appearance selector. */
function rejectsCommentOnlyChoice() {
  const broken = new Map(sources);
  const css = broken.get('dialog-size.css');
  assert.ok(css);
  broken.set(
    'dialog-size.css',
    `${css.replace("[data-size='xs']", "[data-size='missing']")}\n/* [data-size='xs'] */`,
  );
  assert.throws(
    /** Check the altered size rule after comments are removed. */
    () => verifyAuthoredCssContract(broken),
    /Missing authored dialog CSS selector: \[data-size='xs'\]/,
  );
}

test('current authored CSS covers migrated selectors', verifiesCurrentSources);
test('authored CSS gate rejects a missing public part', rejectsMissingPart);
test('authored CSS gate ignores selector text in comments', rejectsCommentOnlyChoice);
