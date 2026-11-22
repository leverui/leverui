import assert from 'node:assert/strict';
import test from 'node:test';
import { contrastTextColor } from '../../website/src/lib/contrast.ts';

/** Reject a color that cannot come from the site's color picker. */
function rejectInvalidColor() {
  contrastTextColor('blue');
}

/** Check the crossover where white text becomes less readable than black. */
function verifyContrastChoices() {
  assert.equal(contrastTextColor('#000000'), '#ffffff');
  assert.equal(contrastTextColor('#006f97'), '#ffffff');
  assert.equal(contrastTextColor('#777777'), '#000000');
  assert.equal(contrastTextColor('#008db8'), '#000000');
  assert.equal(contrastTextColor('#ffffff'), '#000000');
  assert.throws(rejectInvalidColor, /Expected a six-digit CSS hex color/);
}

test('chooses readable text for dark, light, and boundary colors', verifyContrastChoices);
