import assert from 'node:assert/strict';
import test from 'node:test';
import { isExcludedPackagePath } from '../../scripts/package-content-policy.mjs';

/** Reject common compiled test and story artifact paths. */
function checkExcludedPaths() {
  for (const path of [
    'dist/components/button.spec.js',
    'dist/components/button.test.js',
    'dist/components/button.stories.js',
    'dist/components/button.stories.mdx',
    'dist/tests/button.js',
    'dist/stories/button.js',
    'dist/.storybook/button.js',
    'dist/__tests__/button.js',
    'dist/__snapshots__/button.js',
  ]) {
    assert.equal(isExcludedPackagePath(path), true, path);
  }
}

/** Preserve generated runtime files and their source maps. */
function checkAllowedPaths() {
  for (const path of ['dist/components/button.js', 'dist/components/button.js.map']) {
    assert.equal(isExcludedPackagePath(path), false, path);
  }
}

test('rejects test and story files from package output', checkExcludedPaths);
test('allows runtime files and source maps', checkAllowedPaths);
