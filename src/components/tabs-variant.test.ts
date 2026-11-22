import { expect, test } from 'vitest';
import { tabsVariantAttributes } from './tabs-variant';

/** Preserve every scalar treatment and the default line selection. */
function verifiesScalarVariants(): void {
  for (const variant of ['line', 'subtle', 'enclosed', 'outline', 'plain']) {
    expect(tabsVariantAttributes(variant)['data-variant']).toBe(variant);
  }
  expect(tabsVariantAttributes(undefined)['data-variant']).toBe('line');
}

test('Tabs reflects every scalar variant in authored CSS attributes', verifiesScalarVariants);

/** Reflect all finite responsive variants without a media observer. */
function verifiesResponsiveVariants(): void {
  expect(tabsVariantAttributes({ base: 'line', md: 'outline', xl: 'enclosed' })).toEqual({
    'data-variant': 'line',
    'data-variant-responsive': '',
    'data-variant-sm': undefined,
    'data-variant-md': 'outline',
    'data-variant-lg': undefined,
    'data-variant-xl': 'enclosed',
    'data-variant-2xl': undefined,
  });
  expect(tabsVariantAttributes(['plain', null, 'subtle'])['data-variant-md']).toBe('subtle');
  expect(tabsVariantAttributes({ sm: 'enclosed' })['data-variant']).toBe('line');
}

test('Tabs reflects all finite responsive variants', verifiesResponsiveVariants);

/** Reject unsupported values before they reach the native DOM. */
function verifiesInvalidVariants(): void {
  for (const variant of [{ tablet: 'plain' }, { base: 'ghost' }, ['line', 'ghost']]) {
    expect(() => tabsVariantAttributes(variant)).toThrow(TypeError);
  }
}

test('Tabs rejects invalid finite variant choices', verifiesInvalidVariants);
