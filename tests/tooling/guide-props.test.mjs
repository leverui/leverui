import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { findUnknownProps } from '../../scripts/guide-props.mjs';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

/** Every prop in a component guide's props table exists on the component it documents. */
function documentsRealProps() {
  const { checked, failures } = findUnknownProps(projectRoot);
  assert.ok(checked > 1000, `Only ${checked} documented props were found.`);
  assert.deepEqual(failures, []);
}

test('component guides document only props the components accept', documentsRealProps);
