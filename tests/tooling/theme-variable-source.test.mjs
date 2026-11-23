import assert from 'node:assert/strict';
import test from 'node:test';
import { paletteAliases, themeVariables } from '../../scripts/theme-variable-source.mjs';

/** Keep the public variable tied to authored CSS after system removal. */
async function readsAuthoredThemeValues() {
  const variables = await themeVariables();
  assert.equal(variables.size, 485);
  assert.deepEqual(variables.get('--lui-colors-bg'), {
    variable: '--lui-colors-bg',
    category: 'colors',
    source: 'mode-light.css',
    light: 'var(--lui-colors-white)',
    dark: 'var(--lui-colors-black)',
  });
  assert.equal(variables.get('--lui-sizes-0\\.5')?.base, '0.125rem');
  assert.equal(variables.has('--lui-progress-stripe-color'), false);
}

/** Include only palette aliases that the stylesheet currently declares. */
async function readsAuthoredPaletteAliases() {
  const aliases = await paletteAliases();
  assert.equal(aliases.length, 19);
  assert.ok(aliases.includes('--lui-colors-color-palette-solid'));
  assert.ok(!aliases.includes('--lui-colors-color-palette-panel'));
}

test('theme variable source reads authored CSS values and modes', readsAuthoredThemeValues);
test('theme variable source lists authored palette aliases', readsAuthoredPaletteAliases);
