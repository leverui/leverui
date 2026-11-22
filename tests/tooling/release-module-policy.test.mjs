import assert from 'node:assert/strict';
import test from 'node:test';
import { assertBoxOnlyModules } from '../../scripts/release-module-policy.mjs';

const packageRoot = '/tmp/consumer/node_modules/@leverui/components';
const box = `${packageRoot}/dist/components/box.js`;
const boxModules = [box, `${packageRoot}/dist/components/native-box.js`];
const zagRoot = '/tmp/consumer/node_modules/@zag-js';
const staticModules = [
  `${zagRoot}/utils/dist/guard.mjs`,
  `${zagRoot}/utils/dist/functions.mjs`,
  `${zagRoot}/core/dist/merge-props.mjs`,
  `${zagRoot}/anatomy/dist/create-anatomy.mjs`,
  `${zagRoot}/combobox/dist/combobox.anatomy.mjs`,
];

/** Verify that only the Box component and known static Zag code are allowed. */
function acceptsStaticModules() {
  assert.doesNotThrow(
    /** Check the complete allowed module set. */ () =>
      assertBoxOnlyModules([...boxModules, ...staticModules], packageRoot),
  );
}

/** A missing Box module must fail rather than report successful tree shaking. */
function rejectsMissingBox() {
  assert.throws(
    /** Check that Box is required. */ () => assertBoxOnlyModules(staticModules, packageRoot),
  );
}

/** Any other published component must fail the Box-only release gate. */
function rejectsUnusedComponent() {
  const button = `${packageRoot}/dist/components/button.js`;
  assert.throws(
    /** Check an unrelated package component. */ () =>
      assertBoxOnlyModules([...boxModules, button], packageRoot),
  );
}

/** Catch interaction modules even when their names omit machine and connect. */
function rejectsOtherZagCode() {
  for (const name of [
    'combobox.dom.mjs',
    'combobox.collection.mjs',
    'combobox.props.mjs',
    'index.mjs',
  ]) {
    const modulePath = `${zagRoot}/combobox/dist/${name}`;
    assert.throws(
      /** Check each alternate Zag interaction module. */
      () => assertBoxOnlyModules([...boxModules, modulePath], packageRoot),
      /unexpected Zag code/,
    );
  }
}

/** Prevent interaction primitives from entering the visual-only bundle. */
function rejectsPrimitiveComponent() {
  const primitive = `${packageRoot}/dist/primitives/components/combobox/combobox-root.js`;
  assert.throws(
    /** Check an unused interaction primitive. */ () =>
      assertBoxOnlyModules([...boxModules, primitive], packageRoot),
    /interaction primitives/,
  );
}

test('allows Box and static Zag modules', acceptsStaticModules);
test('requires the Box browser module', rejectsMissingBox);
test('rejects every other Lever UI component', rejectsUnusedComponent);
test('rejects alternate Zag interaction files', rejectsOtherZagCode);
test('rejects interaction primitives', rejectsPrimitiveComponent);
